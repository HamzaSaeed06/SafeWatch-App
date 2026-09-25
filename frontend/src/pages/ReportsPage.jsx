import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart2, MapPin, Activity, Bell, Cpu, Battery,
  Calendar, Download, CheckCircle, ShieldCheck,
  AlertTriangle, Wifi, Smartphone, Radio, FileText,
  ChevronRight, ArrowUpRight
} from 'lucide-react';

const REPORT_TABS = [
  { id: 'daily', label: 'Daily Safety Report', desc: 'Overall safety summary', icon: BarChart2 },
  { id: 'location', label: 'Location History', desc: 'Movement & location log', icon: MapPin },
  { id: 'zone', label: 'Zone Violations', desc: 'Geofence breach history', icon: Activity },
  { id: 'alert', label: 'Alert History', desc: 'All alert records', icon: Bell },
  { id: 'band', label: 'Band Connectivity', desc: 'Connection uptime', icon: Cpu },
  { id: 'battery', label: 'Battery History', desc: 'Charge level trends', icon: Battery },
  { id: 'movement', label: 'Movement Analytics', desc: 'Distance & activity data', icon: Activity },
];

const WEEKLY_CHART = [
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 2 },
  { day: 'Wed', value: 1 },
  { day: 'Thu', value: 3 },
  { day: 'Fri', value: 1 },
  { day: 'Sat', value: 2 },
  { day: 'Sun', value: 0 },
];

export const ReportsPage = () => {
  const { activeAlertCount, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('daily');
  const [period, setPeriod] = useState('weekly');

  const activeTabMeta = REPORT_TABS.find((t) => t.id === activeTab) || REPORT_TABS[0];
  const maxVal = 3;

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-5 animate-fade-in">
      {/* Top Header Filter & Actions Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Daily / Weekly Toggle */}
        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {['daily', 'weekly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 text-sm font-medium transition-colors capitalize ${
                period === p
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-600 shadow-sm">
          <Calendar size={14} className="text-slate-400" />
          <span>Sep 6 – 12, 2026</span>
        </div>

        {/* Export PDF Button */}
        <button
          onClick={() => addToast(`Exporting ${activeTabMeta.label} as PDF...`, 'success')}
          className="inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300 text-xs px-3 py-1.5 gap-1.5 shadow-sm"
        >
          <Download size={14} />
          <span>Export PDF</span>
        </button>

        {activeAlertCount > 0 && (
          <span className="ml-auto bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-red-200">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {activeAlertCount} Active Alerts
          </span>
        )}
      </div>

      {/* Main Grid Layout: 1 col tabs (left) + 3 cols detail panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Sub-Sidebar (7 Tabs) */}
        <div className="space-y-2">
          {REPORT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                    : 'border-transparent bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{tab.label}</p>
                  <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Panel (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Daily Safety Report Tab Content */}
          {activeTab === 'daily' && (
            <>
              {/* Daily Overview Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-lg">Daily Safety Summary</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle size={12} /> All Safe
                  </span>
                </div>

                {/* 4 Stat Metric Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
                    <p className="text-xl font-bold text-emerald-700">22.4h</p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Safe Hours</p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-100">
                    <p className="text-xl font-bold text-rose-700">2</p>
                    <p className="text-xs text-rose-600 font-medium mt-0.5">Alerts</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                    <p className="text-xl font-bold text-blue-700">147</p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">Zone Checks</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                    <p className="text-xl font-bold text-slate-800">98%</p>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Band Uptime</p>
                  </div>
                </div>
              </div>

              {/* Chart Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">Alert Frequency This Week</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Daily distribution of safety alerts</p>
                  </div>
                </div>

                {/* Bar Chart Container */}
                <div className="flex mt-4">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between text-xs text-slate-400 font-medium pr-3" style={{ height: '160px' }}>
                    <span>3</span>
                    <span>2.25</span>
                    <span>1.5</span>
                    <span>0.75</span>
                    <span>0</span>
                  </div>

                  {/* Bars with dashed gridlines */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-b border-dashed border-slate-100" />
                      ))}
                    </div>

                    <div className="flex items-end justify-around h-[160px] relative z-10">
                      {WEEKLY_CHART.map((item) => (
                        <div key={item.day} className="flex flex-col items-center flex-1 h-full justify-end px-2">
                          <div
                            className="w-full max-w-[32px] rounded-t-md transition-all duration-300 hover:opacity-80"
                            style={{
                              height: item.value > 0 ? `${(item.value / maxVal) * 100}%` : '4px',
                              backgroundColor: item.value > 0 ? '#3B82F6' : '#E2E8F0',
                              minHeight: '4px'
                            }}
                            title={`${item.day}: ${item.value} alerts`}
                          />
                          <span className="text-xs font-medium text-slate-500 mt-2">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Location History Tab Content */}
          {activeTab === 'location' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 text-lg">Location History Log</h3>
                <span className="text-xs text-slate-500">Updated 5 min ago</span>
              </div>
              <div className="space-y-3">
                {[
                  { time: '3:45 PM', location: 'Lincoln Elementary School, 123 Oak St', status: 'In Safe Zone', statusBg: 'bg-emerald-50 text-emerald-700' },
                  { time: '2:15 PM', location: 'Riverside Park, near fountain', status: 'In Safe Zone', statusBg: 'bg-emerald-50 text-emerald-700' },
                  { time: '1:10 PM', location: 'Elm Street & 5th Ave', status: 'Geofence Exit', statusBg: 'bg-amber-50 text-amber-700' },
                  { time: '8:30 AM', location: '742 Evergreen Terrace (Home)', status: 'In Safe Zone', statusBg: 'bg-emerald-50 text-emerald-700' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.location}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.statusBg}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone Violations Tab Content */}
          {activeTab === 'zone' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 text-lg">Geofence Zone Violations</h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  2 Incidents This Week
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { zone: 'Riverside Park Safe Zone', time: 'Today, 3:42 PM', duration: '14 mins outside zone', severity: 'Medium', severityBg: 'bg-amber-100 text-amber-800' },
                  { zone: 'Lincoln Elementary Safe Zone', time: 'Sep 10, 4:15 PM', duration: '8 mins outside zone', severity: 'Low', severityBg: 'bg-blue-100 text-blue-800' }
                ].map((v, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800">{v.zone}</h4>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${v.severityBg}`}>
                        {v.severity} Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Breach Time: {v.time} · Duration: {v.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert History Tab Content */}
          {activeTab === 'alert' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 text-lg">Alert History Records</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Zone Exceeded — Liam Torres', time: 'Today, 3:42 PM', status: 'Active', badgeBg: 'bg-amber-100 text-amber-800' },
                  { title: 'Low Battery (12%) — Sophia Chen', time: 'Today, 2:15 PM', status: 'Active', badgeBg: 'bg-slate-100 text-slate-700' },
                  { title: 'Emergency SOS Triggered', time: 'Sep 8, 9:05 AM', status: 'Resolved', badgeBg: 'bg-emerald-100 text-emerald-800' }
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-50 text-red-600">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="text-xs text-slate-400">{alert.time}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${alert.badgeBg}`}>
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Band Connectivity Tab Content (Matching User's HTML Model) */}
          {activeTab === 'band' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 font-display">Band Connectivity</h3>
              </div>
              <div className="py-8 text-center text-slate-400">
                <BarChart2 size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Detailed band connectivity data would be displayed here in production with real band telemetry.</p>
              </div>
            </div>
          )}

          {/* Battery History Tab Content */}
          {activeTab === 'battery' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 text-lg">Battery History & Level Trends</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Sophia's Band (v3 Pro)</p>
                  <p className="text-2xl font-bold text-rose-600">12%</p>
                  <p className="text-xs text-slate-400">Low battery warning sent</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Liam's Band (v3 Lite)</p>
                  <p className="text-2xl font-bold text-blue-600">74%</p>
                  <p className="text-xs text-slate-400">Normal operation</p>
                </div>
              </div>
            </div>
          )}

          {/* Movement Analytics Tab Content */}
          {activeTab === 'movement' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 text-lg">Movement & Distance Analytics</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-2xl font-bold text-blue-700">4.2 km</p>
                  <p className="text-xs text-blue-600 font-medium">Daily Steps / Distance</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-700">3 Safe Zones</p>
                  <p className="text-xs text-emerald-600 font-medium">Visited Today</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-bold text-slate-800">5.8h</p>
                  <p className="text-xs text-slate-600 font-medium">Active Transit Time</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
