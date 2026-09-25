import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Zap, Lightbulb, AlertTriangle, Smartphone, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { deviceAPI, sosAPI, bandsAPI } from '../services/api';

export default function DevicesPage() {
  const { children, activeAlertCount, addToast, refreshData } = useApp();
  const [loadingChildId, setLoadingChildId] = useState(null);

  const handleHardwareTest = async (testLabel, child) => {
    setLoadingChildId(`${child.id}-${testLabel}`);
    try {
      if (testLabel === 'Test SOS') {
        await sosAPI.triggerSOS(child.id, { lat: 37.7749, lng: -122.4194 });
        addToast(`🚨 Emergency SOS event logged in MongoDB for ${child.name}!`, 'warning');
      } else {
        await deviceAPI.ping({ childId: child.id, testType: testLabel });
        addToast(`[Device API] ${testLabel} command sent to ${child.name}'s band`, 'info');
      }
    } catch (err) {
      addToast(`Command failed: ${err.message || 'Server error'}`, 'danger');
    } finally {
      setLoadingChildId(null);
    }
  };

  const handleDeleteBand = async (childId, childName) => {
    if (!window.confirm(`Are you sure you want to unpair ${childName}'s band?`)) return;
    setLoadingChildId(`delete-${childId}`);
    try {
      await bandsAPI.deleteBand(childId);
      addToast(`${childName}'s band unpaired successfully from backend!`, 'success');
      refreshData();
    } catch (err) {
      addToast(`Failed to delete band: ${err.message}`, 'danger');
    } finally {
      setLoadingChildId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Smart GPS Bands</h1>
          <p className="text-xs text-[#64748B] mt-1">{children.length} active paired bands connected to Express REST API</p>
        </div>
        {activeAlertCount > 0 && (
          <span className="bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />{activeAlertCount} Active Alerts
          </span>
        )}
      </div>

      <div className="space-y-6">
        {children.map((child) => (
          <div key={child.id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="bg-[#DCFCE7] p-3 rounded-xl">
                <Smartphone size={22} className="text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#0F172A]">{child.name}'s GPS Band (v3 Pro)</h3>
                <p className="text-xs text-[#64748B]">ID: {child.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  ● Connected
                </span>
                <button
                  onClick={() => handleDeleteBand(child.id, child.name)}
                  disabled={loadingChildId === `delete-${child.id}`}
                  className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                  title="Unpair Band"
                >
                  {loadingChildId === `delete-${child.id}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>

            {/* Paired child */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8FAFC] rounded-lg">
              <img src={child.photo || child.avatar} alt={child.name} className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]" />
              <span className="text-sm font-semibold text-[#0F172A]">{child.name}</span>
            </div>

            {/* Battery */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-[#64748B]">Battery Level</span>
                <span className="font-bold text-[#16A34A]">{child.batteryPct || 90}%</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all bg-[#16A34A]" style={{ width: `${child.batteryPct || 90}%` }} />
              </div>
            </div>

            {/* Hardware Tests */}
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-3">HARDWARE TEST COMMANDS (EXPRESS API)</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: '⚡', label: 'Test Vibration' },
                  { icon: '💡', label: 'Test LED' },
                  { icon: '🚨', label: 'Test SOS' },
                  { icon: '📱', label: 'Test Tamper' },
                ].map((test) => {
                  const isBtnLoading = loadingChildId === `${child.id}-${test.label}`;
                  return (
                    <button
                      key={test.label}
                      onClick={() => handleHardwareTest(test.label, child)}
                      disabled={isBtnLoading}
                      className="bg-white border border-[#E2E8F0] text-[#334155] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F1F5F9] transition-colors"
                    >
                      {isBtnLoading ? <Loader2 size={13} className="animate-spin" /> : test.icon} {test.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
