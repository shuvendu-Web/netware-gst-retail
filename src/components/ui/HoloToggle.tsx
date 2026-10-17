import React from 'react';

interface HoloToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const HoloToggle: React.FC<HoloToggleProps> = ({
  id = 'holo-toggle',
  checked,
  onChange,
  disabled = false,
  label,
  className = ''
}) => {
  return (
    <div className={`toggle-container ${className}`}>
      <div className="toggle-wrap">
        <input 
          className="toggle-input" 
          id={id} 
          type="checkbox" 
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="toggle-track" htmlFor={id}>
          <div className="track-lines">
            <div className="track-line"></div>
          </div>

          <div className="toggle-thumb">
            <div className="thumb-core"></div>
            <div className="thumb-inner"></div>
            <div className="thumb-scan"></div>
            <div className="thumb-particles">
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
            </div>
          </div>

          <div className="toggle-data">
            <div className="data-text off">OFF</div>
            <div className="data-text on">ON</div>
            <div className="status-indicator off"></div>
            <div className="status-indicator on"></div>
          </div>

          <div className="energy-rings">
            <div className="energy-ring"></div>
            <div className="energy-ring"></div>
            <div className="energy-ring"></div>
          </div>

          <div className="interface-lines">
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
          </div>

          <div className="toggle-reflection"></div>
          <div className="holo-glow"></div>
        </label>
      </div>
      {label && <div className="toggle-label">{label}</div>}
    </div>
  );
};
