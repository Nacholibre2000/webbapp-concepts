type FunnelIconProps = {
  status: 'detoggled' | 'toggled' | 'half-toggled';
};

const FunnelIcon: React.FC<FunnelIconProps> = ({ status }) => {
  // Define colors based on the status
  const fillColor = status === 'toggled' ? '#9CA3AF' : 'transparent';
  const strokeColor = status === 'half-toggled' ? '#9CA3AF' : '#474747';

  return (
    <svg width="24" height="24" viewBox="0 0 348 313" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1.85593,0,0,1.6648,-478.034,-253.841)">
        <rect x="257.571" y="152.475" width="187.487" height="187.487" style={{ fill: "none" }} />
        <g transform="matrix(0.538813,0,0,0.600673,257.571,152.475)">
          <path 
            d="M176.721,14.948C99.75,14.948 37.26,77.438 37.26,154.408C37.26,231.379 99.75,293.869 176.721,293.869C253.691,293.869 316.181,231.379 316.181,154.408C316.181,77.438 253.691,14.948 176.721,14.948ZM92.744,85.495C88.489,85.495 84.581,87.845 82.586,91.604C80.591,95.363 80.835,99.916 83.22,103.44L144.123,193.437C144.123,193.437 144.481,225.699 144.481,225.699C144.531,230.23 147.237,234.309 151.392,236.117L200.124,257.322C203.679,258.869 207.774,258.52 211.017,256.395C214.259,254.27 216.213,250.654 216.213,246.777L216.213,193.487C216.213,193.487 270.558,102.912 270.558,102.912C272.69,99.359 272.745,94.934 270.704,91.329C268.663,87.724 264.84,85.495 260.697,85.495L92.744,85.495Z"
            fill={fillColor}
          />
        </g>
        <g transform="matrix(0.791045,0,0,0.881863,69.9937,45.3114)">
          <path 
            d="M300.298,187.587L414.697,187.587L376.564,251.142L376.564,289.609L343.37,275.166L343.101,250.837L300.298,187.587Z"
            stroke="#9CA3AF" 
            strokeWidth="17"  
            strokeLinecap="round"  
            strokeLinejoin="round"  
            fill={strokeColor}
          />
        </g>
      </g>
    </svg>
  );
};

export default FunnelIcon;
  