type FunnelIconProps = {
    toggled: boolean;
  };
  
  const FunnelIcon: React.FC<FunnelIconProps> = ({ toggled }) => (
    <svg width="14" height="14" viewBox="0 0 188 173" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M9.767,11.043l167.953,0l-55.984,93.307l-0,56.475l-48.733,-21.205l-0.597,-53.881l-62.639,-74.696Z" 
        stroke="#9CA3AF" 
        strokeWidth="20"  
        strokeLinecap="round"  
        strokeLinejoin="round"  
        fill={toggled ? "#9CA3AF" : "transparent"}
      />
    </svg>
  );
  
  export default FunnelIcon;
  