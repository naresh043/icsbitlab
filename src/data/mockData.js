export const kpis = [
  { label: 'Total Assets', value: '1,248', change: '+12%', note: 'vs last week', icon: 'server', tone: 'blue' },
  { label: 'Critical Assets', value: '87', change: '+5%', note: 'vs last week', icon: 'alert', tone: 'red' },
  { label: 'Open Findings', value: '320', change: '+18', note: 'vs last week', icon: 'shield', tone: 'orange' },
  { label: 'Attack Paths', value: '14', change: '+3', note: 'vs last week', icon: 'nodes', tone: 'orange' },
  { label: 'Exposed Critical', value: '9', change: '+4', note: 'vs last week', icon: 'triangle', tone: 'amber' }
];

export const findings = [
  { name: 'Low', value: 120, tone: 'low' },
  { name: 'Medium', value: 95, tone: 'medium' },
  { name: 'High', value: 68, tone: 'high' },
  { name: 'Critical', value: 37, tone: 'critical' }
];

export const riskTrend = [
  { day: '10 Sep', critical: 108, high: 68, medium: 43, low: 21 },
  { day: '11 Sep', critical: 116, high: 73, medium: 47, low: 25 },
  { day: '12 Sep', critical: 84, high: 60, medium: 39, low: 19 },
  { day: '13 Sep', critical: 92, high: 66, medium: 42, low: 23 },
  { day: '14 Sep', critical: 111, high: 75, medium: 50, low: 27 },
  { day: '15 Sep', critical: 130, high: 81, medium: 52, low: 28 },
  { day: '16 Sep', critical: 151, high: 87, medium: 56, low: 27 }
];

export const sites = [
  ['Plant A', 92], ['Plant B', 76], ['Utilities Zone', 64], ['Production Zone', 48], ['DMZ', 36]
];

export const attackPaths = [
  { id: 'AP-014', source: 'Internet', pivot: 'Engineering WS', target: 'PLC-01', steps: 3, risk: 'Critical', score: 94 },
  { id: 'AP-011', source: 'Vendor Access', pivot: 'HMI-02', target: 'SCADA Server', steps: 4, risk: 'High', score: 81 },
  { id: 'AP-009', source: 'Office Network', pivot: 'Jump Host', target: 'Historian', steps: 5, risk: 'High', score: 77 },
  { id: 'AP-006', source: 'Wireless', pivot: 'PLC-12', target: 'Safety Controller', steps: 4, risk: 'Medium', score: 61 }
];

export const changes = [
  ['2:12 PM', 'New asset detected', '192.168.5.23', 'New Asset', 'low'],
  ['1:48 PM', 'Finding severity increased', 'PLC-03', 'Risk Change', 'critical'],
  ['11:30 AM', 'Communication change', 'HMI-02', 'Comm Change', 'medium'],
  ['10:15 AM', 'Asset went offline', 'RTU-05', 'State Change', 'high'],
  ['09:42 AM', 'New finding', 'Engineering WS', 'New Finding', 'critical']
];

export const assets = [
  ['PLC-01', 'PLC', 'Production Zone', 'Online', 'Critical', 94],
  ['HMI-02', 'HMI', 'Production Zone', 'Online', 'High', 81],
  ['SCADA-01', 'SCADA Server', 'Control Zone', 'Online', 'High', 77],
  ['RTU-05', 'RTU', 'Utilities Zone', 'Offline', 'Medium', 61],
  ['ENG-WS-12', 'Engineering WS', 'Corporate IT', 'Online', 'Critical', 89],
  ['HIST-01', 'Historian', 'DMZ', 'Online', 'Medium', 55]
];