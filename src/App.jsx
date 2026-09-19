import React, { useMemo, useState } from 'react';
import heroImage from './assets/industrial-hero.jpg.jpeg';
import sidebarImage from './assets/industrial-sidebar.jpg.jpeg';


import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Box,
  ChevronDown,
  CircleHelp,
  Clock3,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Globe2,
  LayoutDashboard,
  Menu,
  Network,
  Search,
  Server,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  X,
  Zap
} from 'lucide-react';

import {
  kpis,
  findings,
  riskTrend,
  sites,
  attackPaths,
  changes,
  assets
} from './data/mockData';


/* =========================================================
   NAVIGATION
========================================================= */

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Assets', Server],
  ['Findings', ShieldAlert],
  ['Attack Paths', GitBranch],
  ['Network Map', Network],
  ['Changes', Clock3],
  ['Sensors', Gauge],
  ['Reports', FileText]
];


/* =========================================================
   SMALL REUSABLE COMPONENTS
========================================================= */

function Icon({ name, size = 18 }) {
  const icons = {
    server: Server,
    alert: AlertTriangle,
    shield: Shield,
    nodes: GitBranch,
    triangle: ShieldAlert
  };

  const C = icons[name] || Box;

  return <C size={size} strokeWidth={1.8} />;
}


function Severity({ children }) {
  return (
    <span className={`severity ${String(children).toLowerCase()}`}>
      {children}
    </span>
  );
}


function Card({ title, action, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      <div className="card-head">
        <h3>{title}</h3>

        {action && (
          <button
            className="text-button"
            onClick={action.onClick}
          >
            {action.label}
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {children}
    </section>
  );
}


function Sparkline({ data }) {
  const points = data
    .map(
      (v, i) =>
        `${i * (100 / (data.length - 1))},${100 - v / 2}`
    )
    .join(' ');

  return (
    <svg
      className="sparkline"
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}


/* =========================================================
   TREND CHART
========================================================= */

function TrendChart() {
  const max = 170;

  const colors = {
    critical: '#ff5a4f',
    high: '#ff6a00',
    medium: '#ffb020',
    low: '#32d583'
  };

  return (
    <div className="trend">

      <div className="trend-grid">

        {[0, 50, 100, 150, 200].map(v => (
          <span
            key={v}
            style={{
              bottom: `${Math.min(v, max) / max * 100}%`
            }}
          >
            {v}
          </span>
        ))}

        <svg
          viewBox="0 0 700 180"
          preserveAspectRatio="none"
        >
          {Object.keys(colors).map(key => {

            const pts = riskTrend
              .map(
                (d, i) =>
                  `${i * 116.6},${175 -
                    (d[key] / max * 155)}`
              )
              .join(' ');

            return (
              <polyline
                key={key}
                points={pts}
                fill="none"
                stroke={colors[key]}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

      </div>

      <div className="xlabels">
        {riskTrend.map(x => (
          <span key={x.day}>{x.day}</span>
        ))}
      </div>

      <div className="legend-row">
        <span>
          <i className="dot critical" />
          Critical
        </span>

        <span>
          <i className="dot high" />
          High
        </span>

        <span>
          <i className="dot medium" />
          Medium
        </span>

        <span>
          <i className="dot low" />
          Low
        </span>
      </div>

    </div>
  );
}


/* =========================================================
   DONUT
========================================================= */

function Donut({ value = '76' }) {
  return (
    <div className="donut-wrap">

      <div className="donut">

        <div className="donut-center">
          <strong>{value}</strong>
          <small>/ 100</small>
          <em>Moderate Risk</em>
        </div>

      </div>

      <div className="donut-legend">

        <span>
          <i className="dot low" />
          Low
          <b>62%</b>
        </span>

        <span>
          <i className="dot medium" />
          Medium
          <b>28%</b>
        </span>

        <span>
          <i className="dot high" />
          High
          <b>8%</b>
        </span>

        <span>
          <i className="dot critical" />
          Critical
          <b>2%</b>
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ onPath, onNavigate }) {

  const [site, setSite] = useState('All Sites');
  const [severity, setSeverity] =
    useState('All Severities');

  const [range, setRange] =
    useState('Last 7 Days');

  const [query, setQuery] =
    useState('');

  const filteredPaths = useMemo(() => {

    const q = query.toLowerCase();

    return attackPaths
      .filter(p =>
        !q ||
        `${p.source} ${p.pivot} ${p.target}`
          .toLowerCase()
          .includes(q)
      )
      .filter(
        p =>
          severity === 'All Severities' ||
          p.risk === severity
      );

  }, [query, severity]);


  return (
    <div className="page">

      {/* TOP BAR */}

      <header className="topbar">

        <button className="mobile-menu">
          <Menu size={20} />
        </button>

        <div className="search">

          <Search size={17} />

          <input
            value={query}
            onChange={e =>
              setQuery(e.target.value)
            }
            placeholder="Search assets, findings, IPs, devices..."
          />

          <kbd>Ctrl K</kbd>

        </div>

        <select
          value={site}
          onChange={e =>
            setSite(e.target.value)
          }
        >
          <option>All Sites</option>
          <option>Plant A</option>
          <option>Plant B</option>
        </select>

        <select
          value={range}
          onChange={e =>
            setRange(e.target.value)
          }
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>

        <select
          value={severity}
          onChange={e =>
            setSeverity(e.target.value)
          }
        >
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>

        <button className="primary">
          Apply
        </button>

        <button className="icon-btn">
          <Bell size={18} />
          <span className="notif">3</span>
        </button>

        <div className="profile">

          <div className="avatar">
            H
          </div>

          <div>
            <b>Harish G</b>
            <small>Security Analyst</small>
          </div>

          <ChevronDown size={15} />

        </div>

      </header>


      <main>

        {/* HERO */}

        <div
  className="hero"
  style={{
    backgroundImage: `linear-gradient(
      90deg,
      rgba(5, 12, 18, 0.96) 0%,
      rgba(5, 12, 18, 0.78) 45%,
      rgba(5, 12, 18, 0.35) 100%
    ), url(${heroImage})`
  }}
>

          <div>

            <p className="eyebrow">
              <span className="live-dot" />
              LIVE ENVIRONMENT
            </p>

            <h1>
              Security Overview
            </h1>

            <p>
              Real-time visibility into your industrial environment.
            </p>

          </div>

          <div className="hero-status">

            <span className="green-dot" />

            All Systems Operational

            <ChevronDown size={14} />

            <span className="divider" />

            <Clock3 size={14} />

            17 Sep 2026 · 02:30 PM

          </div>

        </div>


        {/* KPI CARDS */}

        <div className="kpi-grid">

          {kpis.map(k => (

            <div
              className="kpi"
              key={k.label}
            >

              <div
                className={`kpi-icon ${k.tone}`}
              >
                <Icon name={k.icon} />
              </div>

              <div>

                <span>{k.label}</span>

                <strong>{k.value}</strong>

                <small
                  className={
                    k.tone === 'red' ||
                    k.tone === 'amber'
                      ? 'up'
                      : ''
                  }
                >
                  {k.change}
                  {' '}
                  <em>{k.note}</em>
                </small>

              </div>

              <Sparkline
                data={[4, 7, 5, 8, 10, 9, 12]}
              />

            </div>

          ))}

        </div>


        {/* ROW 1 */}

        <div className="grid three">

          <Card
            title="Security Posture"
            action={{
              label: 'View details',
              onClick: () =>
                onNavigate('Reports')
            }}
          >
            <Donut />
          </Card>


          <Card
            title="Findings by Severity"
            action={{
              label: 'View all',
              onClick: () =>
                onNavigate('Findings')
            }}
          >

            <div className="bars">

              {findings.map(f => (

                <div
                  className="bar-col"
                  key={f.name}
                >

                  <b>{f.value}</b>

                  <div
                    className={`bar ${f.tone}`}
                    style={{
                      height:
                        `${f.value / 120 * 112}px`
                    }}
                  />

                  <span>{f.name}</span>

                </div>

              ))}

            </div>

          </Card>


          <Card title="Risk Trend">

            <div className="segmented">

              <button className="active">
                7D
              </button>

              <button>
                30D
              </button>

              <button>
                90D
              </button>

            </div>

            <TrendChart />

          </Card>

        </div>


        {/* ROW 2 */}

        <div className="grid three">

          <Card
            title="Asset Visibility"
            action={{
              label: 'View all',
              onClick: () =>
                onNavigate('Assets')
            }}
          >

            <div className="asset-visibility">

              <div className="asset-donut">

                <strong>1,248</strong>
                <small>Assets</small>

              </div>

              <div className="asset-list">

                {[
                  'PLC|24%|low',
                  'HMI|18%|medium',
                  'Engineering WS|16%|info',
                  'Servers|12%|blue',
                  'Network Devices|10%|neutral',
                  'Others|20%|green'
                ].map(x => {

                  const [
                    a,
                    b,
                    c
                  ] = x.split('|');

                  return (
                    <span key={a}>

                      <i
                        className={`dot ${c}`}
                      />

                      {a}

                      <b>{b}</b>

                    </span>
                  );

                })}

              </div>

            </div>


            <div className="mini-stats">

              <span>
                <b>+32</b>
                New Assets
              </span>

              <span>
                <b>18</b>
                Unidentified
              </span>

              <span>
                <b>27</b>
                Inactive
              </span>

            </div>

          </Card>


          <Card
            title="Top Sites / Zones by Risk"
            action={{
              label: 'View all',
              onClick: () =>
                onNavigate('Network Map')
            }}
          >

            <div className="site-bars">

              {sites.map(
                ([name, value]) => (

                  <div key={name}>

                    <span>{name}</span>

                    <div>

                      <i
                        style={{
                          width:
                            `${value}%`
                        }}
                      />

                      <b>{value}</b>

                    </div>

                  </div>

                )
              )}

            </div>

          </Card>


          <Card
            title="Attack Path Preview"
            action={{
              label: 'View map',
              onClick: () =>
                onPath()
            }}
          >

            <div className="path-list">

              {filteredPaths.map(p => (

                <button
                  className="path-row"
                  key={p.id}
                  onClick={() =>
                    onPath(p)
                  }
                >

                  <div className="path-icons">

                    <span>
                      <Globe2 size={14} />
                    </span>

                    <ArrowRight size={12} />

                    <span>
                      <Server size={14} />
                    </span>

                    <ArrowRight size={12} />

                    <span>
                      <Target size={14} />
                    </span>

                  </div>


                  <div className="path-copy">

                    <b>
                      {p.source}
                      {' '}
                      <ArrowRight size={12} />
                      {' '}
                      {p.pivot}
                      {' '}
                      <ArrowRight size={12} />
                      {' '}
                      {p.target}
                    </b>

                    <small>
                      {p.steps} steps ·
                      {' '}
                      <strong>
                        {p.score}% confidence
                      </strong>
                    </small>

                  </div>

                  <Severity>
                    {p.risk}
                  </Severity>

                </button>

              ))}

            </div>

          </Card>

        </div>


        {/* ROW 3 */}

        <div className="grid three">

          <Card
            title="Recent Changes"
            action={{
              label: 'View all',
              onClick: () =>
                onNavigate('Changes')
            }}
          >

            <div className="changes">

              {changes.map(
                (c, i) => (

                  <div key={i}>

                    <span>{c[0]}</span>

                    <i
                      className={`dot ${c[4]}`}
                    />

                    <p>
                      {c[1]}
                      <small>
                        {c[2]} · {c[3]}
                      </small>
                    </p>

                  </div>

                )
              )}

            </div>

          </Card>


          <Card
            title="Network / Topology Snapshot"
            action={{
              label: 'View map',
              onClick: () =>
                onNavigate('Network Map')
            }}
          >

            <NetworkPreview />

          </Card>


          <Card
            title="Platform / Sensor Health"
            action={{
              label: 'View all',
              onClick: () =>
                onNavigate('Sensors')
            }}
          >

            <SensorPreview />

          </Card>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   NETWORK PREVIEW
========================================================= */

function NetworkPreview() {

  return (
    <div className="topology">

      <div className="topo-line l1" />
      <div className="topo-line l2" />
      <div className="topo-line l3" />
      <div className="topo-line l4" />

      <span className="node internet">
        <Globe2 size={18} />
        <small>Internet</small>
      </span>

      <span className="node firewall">
        <Shield size={20} />
        <small>Firewall</small>
      </span>

      <span className="node prod">
        <Zap size={18} />
        <small>Production</small>
      </span>

      <span className="node dmz">
        <Database size={18} />
        <small>DMZ</small>
      </span>

      <span className="node safety">
        <ShieldAlert size={18} />
        <small>Safety</small>
      </span>

    </div>
  );
}


/* =========================================================
   SENSOR PREVIEW
========================================================= */

function SensorPreview() {

  return (
    <>
      <div className="health">

        <div className="health-ring">
          <strong>92%</strong>
          <small>Healthy</small>
        </div>

        <div className="health-list">

          <span>
            <i className="dot low" />
            Sensors online
            <b>23 / 25</b>
          </span>

          <span>
            <i className="dot medium" />
            Degraded
            <b>1</b>
          </span>

          <span>
            <i className="dot critical" />
            Offline
            <b>1</b>
          </span>

          <span>
            <Clock3 size={14} />
            Data recency
            <b>&lt; 5 min</b>
          </span>

        </div>

      </div>

      <div className="notice">

        <CircleHelp size={15} />

        1 sensor in Plant B is reporting limited data.

        <button>
          View details
        </button>

      </div>
    </>
  );
}


/* =========================================================
   ASSETS PAGE
========================================================= */

function AssetsPage() {

  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            ASSET INVENTORY
          </p>

          <h1>
            Assets
          </h1>

          <p>
            Monitor industrial assets, their status,
            zone and security risk.
          </p>

        </div>

        <button className="primary">
          + Add Asset
        </button>

      </div>


      <section className="card">

        <div className="card-head">

          <h3>
            Asset Inventory
          </h3>

          <span>
            {assets.length} monitored assets
          </span>

        </div>


        <div style={{ overflowX: 'auto' }}>

          <table className="asset-table">

            <thead>

              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Score</th>
              </tr>

            </thead>


            <tbody>

              {assets.map(
                ([
                  name,
                  type,
                  zone,
                  status,
                  risk,
                  score
                ]) => (

                  <tr key={name}>

                    <td>
                      <strong>
                        {name}
                      </strong>
                    </td>

                    <td>{type}</td>

                    <td>{zone}</td>

                    <td>
                      <span
                        className={`status-dot ${String(status).toLowerCase()}`}
                      >
                        ● {status}
                      </span>
                    </td>

                    <td>
                      <Severity>
                        {risk}
                      </Severity>
                    </td>

                    <td>
                      <strong>
                        {score}/100
                      </strong>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   FINDINGS PAGE
========================================================= */

function FindingsPage() {

  const [filter, setFilter] =
    useState('All');

  const filtered = findings.filter(
    f =>
      filter === 'All' ||
      f.name === filter
  );

  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            SECURITY FINDINGS
          </p>

          <h1>
            Findings
          </h1>

          <p>
            Review detected security findings
            across the industrial environment.
          </p>

        </div>

        <div className="path-controls">

          <select
            value={filter}
            onChange={e =>
              setFilter(e.target.value)
            }
          >
            <option>All</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button>
            <SlidersHorizontal size={15} />
            Filters
          </button>

        </div>

      </div>


      <div className="grid four">

        {findings.map(f => (

          <div
            className="kpi"
            key={f.name}
          >

            <div
              className={`kpi-icon ${f.tone}`}
            >
              <ShieldAlert size={18} />
            </div>

            <div>

              <span>
                {f.name}
              </span>

              <strong>
                {f.value}
              </strong>

              <small>
                Active findings
              </small>

            </div>

          </div>

        ))}

      </div>


      <section className="card">

        <div className="card-head">

          <h3>
            Finding Overview
          </h3>

          <span>
            {filtered.length} categories
          </span>

        </div>


        <div className="finding-list">

          {filtered.map(f => (

            <div
              className="finding-row"
              key={f.name}
            >

              <div className="finding-icon">
                <AlertTriangle size={18} />
              </div>

              <div className="finding-info">

                <strong>
                  {f.name} Severity Findings
                </strong>

                <small>
                  Security findings requiring
                  analyst review and remediation.
                </small>

              </div>

              <Severity>
                {f.name}
              </Severity>

              <strong className="finding-count">
                {f.value}
              </strong>

              <button className="text-button">
                Investigate
                <ArrowRight size={14} />
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   ATTACK PATH PAGE
========================================================= */

function AttackPath({ selected, setSelected }) {

  const [filter, setFilter] =
    useState('All');

  const paths = attackPaths.filter(
    p =>
      filter === 'All' ||
      p.risk === filter
  );


  const current =
    selected &&
    paths.some(
      p => p.id === selected.id
    )
      ? selected
      : paths[0] || null;


  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            INVESTIGATION WORKSPACE
          </p>

          <h1>
            Attack Path Map
          </h1>

          <p>
            Understand how exposure can traverse
            the environment to high-value assets.
          </p>

        </div>


        <div className="path-controls">

          <button>
            <Search size={15} />
            Search graph
          </button>

          <select
            value={filter}
            onChange={e =>
              setFilter(e.target.value)
            }
          >
            <option>All</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
          </select>

          <button>
            <SlidersHorizontal size={15} />
            Filters
          </button>

        </div>

      </div>


      <div className="attack-layout">

        {/* PATH SIDEBAR */}

        <aside className="path-sidebar">

          <div className="side-title">

            <b>
              Detected paths
            </b>

            <span>
              {paths.length}
            </span>

          </div>


          <div className="filter-chips">

            <span>
              14 total
            </span>

            <span className="critical">
              3 critical
            </span>

            <span className="high">
              7 high
            </span>

          </div>


          {paths.map(p => (

            <button
              key={p.id}
              className={`path-card ${
                current?.id === p.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                setSelected(p)
              }
            >

              <div>

                <b>{p.id}</b>

                <Severity>
                  {p.risk}
                </Severity>

              </div>

              <strong>
                {p.source} → {p.target}
              </strong>

              <small>
                {p.steps} hops ·
                {' '}
                {p.score}% confidence
              </small>

            </button>

          ))}

        </aside>


        {/* GRAPH */}

        <section className="graph">

          <div className="graph-toolbar">

            <span>
              Selected path:
              {' '}
              <b>
                {current?.id}
              </b>
            </span>

            <div>

              <button>−</button>
              <button>100%</button>
              <button>+</button>
              <button>Fit</button>

            </div>

          </div>


          <div className="graph-canvas">

            <div className="zone-label z1">
              EXTERNAL
            </div>

            <div className="zone-label z2">
              CORPORATE IT
            </div>

            <div className="zone-label z3">
              CONTROL ZONE
            </div>


            <svg
              className="connections"
              viewBox="0 0 800 650"
            >

              <defs>

                <marker
                  id="arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                >
                  <path
                    d="M0,0 L0,6 L6,3 z"
                    fill="#ff6a00"
                  />
                </marker>

              </defs>


              <path
                d="M115 320 C190 250 230 240 320 270"
                markerEnd="url(#arrow)"
              />

              <path
                d="M350 285 C430 220 470 210 545 250"
                markerEnd="url(#arrow)"
              />

              <path
                d="M570 270 C640 300 665 330 705 365"
                markerEnd="url(#arrow)"
              />

              <path
                d="M350 315 C430 360 485 390 550 430"
                markerEnd="url(#arrow)"
                className="muted-path"
              />

            </svg>


            <div className="graph-node source">

              <div className="node-icon">
                <Globe2 />
              </div>

              <b>Internet</b>

              <small>
                Entry point · External
              </small>

              <Severity>
                Critical
              </Severity>

            </div>


            <div className="graph-node pivot">

              <div className="node-icon">
                <Server />
              </div>

              <b>
                Engineering WS
              </b>

              <small>
                Windows · 192.168.5.23
              </small>

              <Severity>
                High
              </Severity>

            </div>


            <div className="graph-node plc">

              <div className="node-icon">
                <Zap />
              </div>

              <b>PLC-01</b>

              <small>
                Production · Crown jewel
              </small>

              <Severity>
                Critical
              </Severity>

            </div>


            <div className="graph-node scada">

              <div className="node-icon">
                <Database />
              </div>

              <b>
                SCADA-01
              </b>

              <small>
                Control Zone · TCP/502
              </small>

              <Severity>
                High
              </Severity>

            </div>


            <div className="edge-label e1">
              RDP · Suspicious
            </div>

            <div className="edge-label e2">
              SMB · Lateral
            </div>

            <div className="edge-label e3">
              Modbus/TCP · Critical
            </div>


            <div className="graph-legend">

              <span>
                <i className="line orange" />
                Selected path
              </span>

              <span>
                <i className="line gray" />
                Other relationship
              </span>

              <span>
                Confidence:
                {' '}
                <b>
                  {current?.score}%
                </b>
              </span>

            </div>

          </div>

        </section>


        {/* INVESTIGATION PANEL */}

        <aside className="investigate">

          <div className="investigate-head">

            <div>

              <p>
                SELECTED PATH
              </p>

              <h3>
                {current?.id}
              </h3>

            </div>

            <button>
              <X size={17} />
            </button>

          </div>


          <div className="risk-score">

            <span>
              Path risk
            </span>

            <strong>
              {current?.score}
            </strong>

            <small>
              /100
            </small>

            <Severity>
              {current?.risk}
            </Severity>

          </div>


          <h4>
            Path sequence
          </h4>


          <ol className="sequence">

            <li>

              <span>01</span>

              <b>
                {current?.source}
              </b>

              <small>
                External exposure
              </small>

            </li>

            <li>

              <span>02</span>

              <b>
                {current?.pivot}
              </b>

              <small>
                RDP service · suspicious
              </small>

            </li>

            <li>

              <span>03</span>

              <b>
                {current?.target}
              </b>

              <small>
                Modbus/TCP · crown jewel
              </small>

            </li>

          </ol>


          <h4>
            Why it matters
          </h4>

          <p className="body-copy">

            This path creates a reachable route
            from an exposed entry point to a
            critical operational asset. The
            selected relationship crosses a trust
            boundary and warrants investigation.

          </p>


          <h4>
            Evidence
          </h4>


          <div className="evidence">
            <span>✓</span>
            Asset is reachable from external network
          </div>

          <div className="evidence">
            <span>✓</span>
            Unusual RDP communication observed
          </div>

          <div className="evidence">
            <span>✓</span>
            Target asset is classified critical
          </div>


          <button className="primary wide">
            <ShieldAlert size={16} />
            Start investigation
          </button>

        </aside>

      </div>

    </div>
  );
}


/* =========================================================
   NETWORK MAP PAGE
========================================================= */

function NetworkMapPage() {

  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            NETWORK VISIBILITY
          </p>

          <h1>
            Network Map
          </h1>

          <p>
            Explore zones, connectivity and
            industrial network relationships.
          </p>

        </div>

        <div className="path-controls">

          <button>
            <Search size={15} />
            Search network
          </button>

          <button>
            <SlidersHorizontal size={15} />
            Filters
          </button>

        </div>

      </div>


      <div className="grid two">

        <Card title="Network Topology">

          <div className="large-topology">

            <div className="network-node internet-node">
              <Globe2 />
              <strong>Internet</strong>
              <small>External</small>
            </div>

            <div className="network-node firewall-node">
              <Shield />
              <strong>Firewall</strong>
              <small>Perimeter</small>
            </div>

            <div className="network-node corporate-node">
              <Server />
              <strong>Corporate IT</strong>
              <small>42 assets</small>
            </div>

            <div className="network-node dmz-node">
              <Database />
              <strong>DMZ</strong>
              <small>18 assets</small>
            </div>

            <div className="network-node production-node">
              <Zap />
              <strong>Production Zone</strong>
              <small>486 assets</small>
            </div>

            <div className="network-node safety-node">
              <ShieldAlert />
              <strong>Safety Zone</strong>
              <small>72 assets</small>
            </div>

          </div>

        </Card>


        <Card title="Zone Summary">

          <div className="site-bars">

            <div>
              <span>
                Production Zone
              </span>

              <div>
                <i style={{ width: '82%' }} />
                <b>82</b>
              </div>
            </div>

            <div>
              <span>
                Corporate IT
              </span>

              <div>
                <i style={{ width: '61%' }} />
                <b>61</b>
              </div>
            </div>

            <div>
              <span>
                DMZ
              </span>

              <div>
                <i style={{ width: '48%' }} />
                <b>48</b>
              </div>
            </div>

            <div>
              <span>
                Safety Zone
              </span>

              <div>
                <i style={{ width: '35%' }} />
                <b>35</b>
              </div>
            </div>

          </div>

        </Card>

      </div>


      <section className="card">

        <div className="card-head">

          <h3>
            Network Relationships
          </h3>

          <span>
            Live topology snapshot
          </span>

        </div>

        <div className="finding-list">

          {[
            ['Internet → Firewall', 'External connection', 'High'],
            ['Firewall → Corporate IT', 'Allowed traffic', 'Medium'],
            ['Corporate IT → Production', 'Trusted route', 'High'],
            ['Production → Safety Zone', 'Restricted connection', 'Medium']
          ].map(
            ([name, type, risk]) => (

              <div
                className="finding-row"
                key={name}
              >

                <div className="finding-icon">
                  <Network size={18} />
                </div>

                <div className="finding-info">
                  <strong>{name}</strong>
                  <small>{type}</small>
                </div>

                <Severity>
                  {risk}
                </Severity>

                <button className="text-button">
                  Inspect
                  <ArrowRight size={14} />
                </button>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   CHANGES PAGE
========================================================= */

function ChangesPage() {

  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            ACTIVITY MONITOR
          </p>

          <h1>
            Recent Changes
          </h1>

          <p>
            Track asset, communication and
            configuration changes.
          </p>

        </div>

        <button className="primary">
          Export Changes
        </button>

      </div>


      <section className="card">

        <div className="card-head">

          <h3>
            Change Timeline
          </h3>

          <span>
            Last 24 hours
          </span>

        </div>


        <div className="changes">

          {changes.map(
            (c, i) => (

              <div key={i}>

                <span>
                  {c[0]}
                </span>

                <i
                  className={`dot ${c[4]}`}
                />

                <p>
                  {c[1]}

                  <small>
                    {c[2]} · {c[3]}
                  </small>
                </p>

                <button className="text-button">
                  View
                  <ArrowRight size={14} />
                </button>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   SENSORS PAGE
========================================================= */

function SensorsPage() {

  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            PLATFORM HEALTH
          </p>

          <h1>
            Sensors
          </h1>

          <p>
            Monitor collection health and data
            freshness across deployed sensors.
          </p>

        </div>

        <button className="primary">
          Refresh Status
        </button>

      </div>


      <div className="grid three">

        <Card title="Overall Health">

          <div className="health">

            <div className="health-ring">
              <strong>92%</strong>
              <small>Healthy</small>
            </div>

            <div className="health-list">

              <span>
                <i className="dot low" />
                Online
                <b>23</b>
              </span>

              <span>
                <i className="dot medium" />
                Degraded
                <b>1</b>
              </span>

              <span>
                <i className="dot critical" />
                Offline
                <b>1</b>
              </span>

            </div>

          </div>

        </Card>


        <Card title="Data Recency">

          <div className="sensor-stat">
            <strong>
              &lt; 5 min
            </strong>

            <span>
              Current data freshness
            </span>
          </div>

          <div className="sensor-progress">
            <i style={{ width: '92%' }} />
          </div>

        </Card>


        <Card title="Coverage">

          <div className="sensor-stat">
            <strong>
              25
            </strong>

            <span>
              Deployed sensors
            </span>
          </div>

          <div className="sensor-progress">
            <i style={{ width: '96%' }} />
          </div>

        </Card>

      </div>


      <section className="card">

        <div className="card-head">

          <h3>
            Sensor Status
          </h3>

          <span>
            25 sensors monitored
          </span>

        </div>


        <div className="finding-list">

          {[
            ['Sensor-PL-A01', 'Plant A · Production', 'Online', 'Low'],
            ['Sensor-PL-A02', 'Plant A · Control', 'Online', 'Low'],
            ['Sensor-PL-B01', 'Plant B · Production', 'Degraded', 'Medium'],
            ['Sensor-PL-B02', 'Plant B · DMZ', 'Online', 'Low'],
            ['Sensor-UT-05', 'Utilities Zone', 'Offline', 'High']
          ].map(
            ([name, zone, status, risk]) => (

              <div
                className="finding-row"
                key={name}
              >

                <div className="finding-icon">
                  <Gauge size={18} />
                </div>

                <div className="finding-info">

                  <strong>
                    {name}
                  </strong>

                  <small>
                    {zone}
                  </small>

                </div>

                <span className="status-dot">
                  ● {status}
                </span>

                <Severity>
                  {risk}
                </Severity>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   REPORTS PAGE
========================================================= */

function ReportsPage() {

  return (
    <div className="page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            SECURITY REPORTING
          </p>

          <h1>
            Reports
          </h1>

          <p>
            Security posture, risk and operational
            reports for your environment.
          </p>

        </div>

        <button className="primary">
          Generate Report
        </button>

      </div>


      <div className="grid three">

        <Card title="Security Posture">

          <div className="report-number">
            76
            <small>/100</small>
          </div>

          <p>
            Overall environment security posture
          </p>

        </Card>


        <Card title="Critical Exposure">

          <div className="report-number">
            9
          </div>

          <p>
            Critical assets currently exposed
          </p>

        </Card>


        <Card title="Open Findings">

          <div className="report-number">
            320
          </div>

          <p>
            Findings requiring review
          </p>

        </Card>

      </div>


      <section className="card">

        <div className="card-head">

          <h3>
            Available Reports
          </h3>

          <span>
            Security reporting center
          </span>

        </div>


        <div className="finding-list">

          {[
            [
              'Executive Security Summary',
              'Security posture and critical exposure overview'
            ],
            [
              'Industrial Asset Inventory',
              'Complete asset visibility and classification report'
            ],
            [
              'Attack Path Analysis',
              'Reachability and high-risk attack path analysis'
            ],
            [
              'Sensor Health Report',
              'Platform health and data collection status'
            ]
          ].map(
            ([title, description]) => (

              <div
                className="finding-row"
                key={title}
              >

                <div className="finding-icon">
                  <FileText size={18} />
                </div>

                <div className="finding-info">

                  <strong>
                    {title}
                  </strong>

                  <small>
                    {description}
                  </small>

                </div>

                <button className="text-button">
                  Open report
                  <ArrowRight size={14} />
                </button>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   STATES PAGE
========================================================= */

function States() {

  return (

    <div className="page states-page">

      <div className="subhead">

        <div>

          <p className="eyebrow">
            DESIGN STATES
          </p>

          <h1>
            Resilience & Accessibility
          </h1>

          <p>
            Clear communication when data is
            incomplete, delayed or unavailable.
          </p>

        </div>

      </div>


      <div className="state-grid">

        {[
          [
            'Normal',
            'Healthy data, current information and no urgent issue.',
            'green',
            'All systems operational'
          ],

          [
            'High Risk',
            'A critical finding or attack path requires attention.',
            'critical',
            '9 exposed critical assets'
          ],

          [
            'Degraded Data',
            'Collection quality is impaired; conclusions may be incomplete.',
            'medium',
            '1 sensor reporting limited data'
          ],

          [
            'Unknown',
            'Insufficient information — certainty is intentionally not implied.',
            'neutral',
            'Coverage unavailable'
          ],

          [
            'Empty',
            'No results after the active filters are applied.',
            'neutral',
            'No matching findings'
          ],

          [
            'Large Data Volume',
            'Thousands of relationships require progressive disclosure.',
            'blue',
            '1,248 assets · 14 paths'
          ]

        ].map(
          ([t, d, tone, c]) => (

            <div
              className="state-card"
              key={t}
            >

              <div
                className={`state-icon ${tone}`}
              >

                {tone === 'green'
                  ? <Shield />
                  : tone === 'critical'
                    ? <AlertTriangle />
                    : <CircleHelp />
                }

              </div>

              <h3>
                {t}
              </h3>

              <p>
                {d}
              </p>

              <div className="state-example">
                {c}
              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [view, setView] =
    useState('Dashboard');

  const [selected, setSelected] =
    useState(null);


  const openPath = path => {

    setSelected(
      path || attackPaths[0]
    );

    setView('Attack Paths');

  };


  let content;


  if (view === 'Dashboard') {

    content = (
      <Dashboard
        onPath={openPath}
        onNavigate={setView}
      />
    );

  } else if (view === 'Assets') {

    content = <AssetsPage />;

  } else if (view === 'Findings') {

    content = <FindingsPage />;

  } else if (view === 'Attack Paths') {

    content = (
      <AttackPath
        selected={selected}
        setSelected={setSelected}
      />
    );

  } else if (view === 'Network Map') {

    content = <NetworkMapPage />;

  } else if (view === 'Changes') {

    content = <ChangesPage />;

  } else if (view === 'Sensors') {

    content = <SensorsPage />;

  } else if (view === 'Reports') {

    content = <ReportsPage />;

  } else if (view === 'States') {

    content = <States />;

  } else {

    content = (
      <Dashboard
        onPath={openPath}
        onNavigate={setView}
      />
    );

  }


  return (

    <div className="app-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>

          <div>

            <strong>
              ICS<span>Guard</span>
            </strong>

            <small>
              Industrial Cybersecurity
            </small>

          </div>

        </div>


        <nav>

          {nav.map(
            ([name, C]) => (

              <button
                key={name}
                className={
                  view === name
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setView(name)
                }
              >

                <C size={18} />

                <span>
                  {name}
                </span>

                {name === 'Attack Paths' && (
                  <b>
                    14
                  </b>
                )}

              </button>

            )
          )}

        </nav>


        <div className="sidebar-bottom">
  <div
    className="sidebar-industrial-image"
    style={{ backgroundImage: `url(${sidebarImage})` }}
  >
    <div className="sidebar-image-overlay">
      <h2>Secure<br />Asset<br />Safer Tomorrow</h2>
    </div>
  </div>

  <div className="secure-card">
    <Shield size={18} />
    <div>
      <b>OT Security</b>
      <small>Secure operations.</small>
    </div>
  <small>v1.0.0 · Enterprise Preview</small>
</div>

          <div className="secure-card">

            <Shield size={18} />

            <div>

              <b>
                OT Security
              </b>

              <small>
                Secure operations.
              </small>

            </div>

          </div>

          <small>
            v1.0.0 · Enterprise Preview
          </small>

        </div>

      </aside>


      {/* CONTENT */}

      <div className="content">
        {content}
      </div>

    </div>
  );
}


export default App;