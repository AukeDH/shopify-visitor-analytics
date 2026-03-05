'use strict';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'analytics-data.json');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch(e) {}
  return { sessions: {} };
}

function saveData(data) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) { console.error(e); }
}

function purgeOld(data) {
  const cutoff = Date.now() - 30*24*60*60*1000;
  for (const id in data.sessions) {
    if (data.sessions[id].startTime < cutoff) delete data.sessions[id];
  }
  return data;
}

function getCountry(ip) {
  return new Promise((resolve) => {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return resolve('XX');
    }
    const options = {
      hostname: 'ip-api.com',
      path: '/json/' + ip + '?fields=countryCode',
      method: 'GET',
      timeout: 3000
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.countryCode || 'XX');
        } catch(e) { resolve('XX'); }
      });
    });
    req.on('error', () => resolve('XX'));
    req.on('timeout', () => { req.destroy(); resolve('XX'); });
    req.end();
  });
}

function getIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers['cf-connecting-ip'] || req.socket.remoteAddress || '0.0.0.0';
}

app.post('/api/track', async (req, res) => {
  try {
    const { sessionId, eventType, page, scrollDepth, referrer, device, store, totalTime, timestamp } = req.body;
    if (!sessionId || !eventType) return res.status(200).json({ ok: true });
    const data = purgeOld(loadData());
    const now = Date.now();
    if (!data.sessions[sessionId]) {
      const cfCountry = req.headers['cf-ipcountry'];
      let country = cfCountry && cfCountry !== 'XX' ? cfCountry : null;
      if (!country) {
        const ip = getIP(req);
        country = await getCountry(ip);
      }
      data.sessions[sessionId] = {
        sessionId, startTime: timestamp || now, lastHeartbeat: now,
        pages: [], scrollDepths: {}, referrer: referrer || '', device: device || 'unknown',
        converted: false, bounced: true, totalTime: 0,
        country: country || 'XX',
        store: store || 'unknown', conversionType: null, pageviews: 0
      };
    }
    const s = data.sessions[sessionId];
    s.lastHeartbeat = now;
    if (store) s.store = store;
    if (eventType === 'pageview') {
      s.pages.push(page || '/');
      s.pageviews = (s.pageviews || 0) + 1;
      if (s.pageviews > 1) s.bounced = false;
      if (referrer && !s.referrer) s.referrer = referrer;
      if (device) s.device = device;
    } else if (eventType === 'scroll') {
      if (page && scrollDepth !== undefined) s.scrollDepths[page] = Math.max(s.scrollDepths[page] || 0, scrollDepth);
    } else if (eventType === 'heartbeat') {
      if (page && !s.pages.includes(page)) s.pages.push(page);
    } else if (eventType === 'exit') {
      if (totalTime) s.totalTime = Math.max(s.totalTime || 0, totalTime);
    } else if (eventType === 'conversion') {
      s.converted = true; s.bounced = false; s.conversionType = page || 'unknown';
      if (page) s.pages.push(page);
      s.pageviews = (s.pageviews || 0) + 1;
    }
    saveData(data);
    res.status(200).json({ ok: true });
  } catch(e) { res.status(200).json({ ok: true }); }
});

app.get('/api/track/exclude', (req, res) => {
  if (req.query.action === 'remove') {
    res.clearCookie('_vt_exclude', { path: '/' });
    res.json({ ok: true, excluded: false });
  } else {
    res.cookie('_vt_exclude', '1', { maxAge: 365*24*60*60*1000, path: '/', sameSite: 'None', secure: true });
    res.json({ ok: true, excluded: true });
  }
});

app.get('/api/analytics/stats', (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const store = req.query.store || null;
    const data = purgeOld(loadData());
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const twoMin = Date.now() - 2 * 60 * 1000;
    let sessions = Object.values(data.sessions).filter(s => s.startTime >= cutoff);
    if (store && store !== 'all') sessions = sessions.filter(s => s.store && (s.store === store || s.store.includes(store)));
    const total = sessions.length;
    const conversions = sessions.filter(s => s.converted).length;
    const bounced = sessions.filter(s => s.bounced).length;
    let liveAll = Object.values(data.sessions).filter(s => s.lastHeartbeat >= twoMin);
    if (store && store !== 'all') liveAll = liveAll.filter(s => s.store && (s.store === store || s.store.includes(store)));
    const totalTime = sessions.reduce((sum, s) => sum + (s.totalTime || 0), 0);
    const totalPages = sessions.reduce((sum, s) => sum + (s.pageviews || s.pages.length || 1), 0);
    const daily = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const k = d.toISOString().split('T')[0];
      daily[k] = { visitors: 0, conversions: 0 };
    }
    sessions.forEach(s => {
      const k = new Date(s.startTime).toISOString().split('T')[0];
      if (daily[k]) { daily[k].visitors++; if (s.converted) daily[k].conversions++; }
    });
    const countries = {};
    sessions.forEach(s => {
      const c = s.country || 'XX';
      if (!countries[c]) countries[c] = { visitors: 0, conversions: 0 };
      countries[c].visitors++;
      if (s.converted) countries[c].conversions++;
    });
    const devices = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 };
    sessions.forEach(s => { devices[s.device] = (devices[s.device] || 0) + 1; });
    const sources = {};
    sessions.forEach(s => {
      let src = 'direct';
      if (s.referrer) { try { src = new URL(s.referrer).hostname; } catch(e) { src = s.referrer; } }
      sources[src] = (sources[src] || 0) + 1;
    });
    const funnel = {
      productViews: sessions.filter(s => s.pages.some(p => p.startsWith('/products/'))).length,
      cartViews: sessions.filter(s => s.pages.some(p => p.startsWith('/cart'))).length,
      checkoutStarted: sessions.filter(s => s.pages.some(p => p.startsWith('/checkout'))).length,
      ordersCompleted: sessions.filter(s => s.converted && s.conversionType === '/thank_you').length
    };
    res.json({
      liveVisitors: liveAll.length, totalVisitors: total, conversions,
      conversionRate: total > 0 ? ((conversions / total) * 100).toFixed(1) : '0.0',
      bounceRate: total > 0 ? ((bounced / total) * 100).toFixed(1) : '0.0',
      avgBounceTime: bounced > 0 ? Math.round(totalTime / Math.max(bounced, 1)) : 0,
      avgTimeOnSite: total > 0 ? Math.round(totalTime / total) : 0,
      pagesPerVisit: total > 0 ? (totalPages / total).toFixed(1) : '0.0',
      daily: Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0])).map(([date, v]) => ({ date, ...v })),
      countries: Object.entries(countries).sort((a, b) => b[1].visitors - a[1].visitors).slice(0, 10).map(([country, v]) => ({ country, ...v })),
      devices,
      sources: Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([source, count]) => ({ source, count })),
      funnel
    });
  } catch(e) { res.status(200).json({ error: e.message }); }
});

app.get('/api/analytics/sessions', (req, res) => {
  try {
    const store = req.query.store || null, limit = parseInt(req.query.limit) || 200;
    const data = purgeOld(loadData());
    let sessions = Object.values(data.sessions);
    if (store && store !== 'all') sessions = sessions.filter(s => s.store && (s.store === store || s.store.includes(store)));
    sessions.sort((a, b) => b.startTime - a.startTime);
    res.json(sessions.slice(0, limit));
  } catch(e) { res.status(200).json([]); }
});

app.get('/api/analytics/realtime', (req, res) => {
  try {
    const store = req.query.store || null, twoMin = Date.now() - 2 * 60 * 1000;
    const data = loadData();
    let active = Object.values(data.sessions).filter(s => s.lastHeartbeat >= twoMin);
    if (store && store !== 'all') active = active.filter(s => s.store && (s.store === store || s.store.includes(store)));
    res.json(active.map(s => ({ sessionId: s.sessionId, currentPage: s.pages[s.pages.length - 1] || '/', device: s.device, country: s.country, store: s.store, startTime: s.startTime, lastHeartbeat: s.lastHeartbeat })));
  } catch(e) { res.status(200).json([]); }
});

app.get('/api/analytics/pages', (req, res) => {
  try {
    const store = req.query.store || null, days = parseInt(req.query.days) || 7;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const data = purgeOld(loadData());
    let sessions = Object.values(data.sessions).filter(s => s.startTime >= cutoff);
    if (store && store !== 'all') sessions = sessions.filter(s => s.store && (s.store === store || s.store.includes(store)));
    const pages = {};
    sessions.forEach(s => {
      s.pages.forEach(p => {
        if (!pages[p]) pages[p] = { page: p, views: 0, totalScroll: 0, scrollCount: 0 };
        pages[p].views++;
        if (s.scrollDepths && s.scrollDepths[p]) { pages[p].totalScroll += s.scrollDepths[p]; pages[p].scrollCount++; }
      });
    });
    res.json(Object.values(pages).map(p => ({ page: p.page, views: p.views, avgScroll: p.scrollCount > 0 ? Math.round(p.totalScroll / p.scrollCount) : 0 })).sort((a, b) => b.views - a.views).slice(0, 50));
  } catch(e) { res.status(200).json([]); }
});

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log('Visitor Analytics running on port ' + PORT);
  if (!fs.existsSync(DATA_FILE)) saveData({ sessions: {} });
  const pub = path.join(__dirname, 'public');
  if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });
});
