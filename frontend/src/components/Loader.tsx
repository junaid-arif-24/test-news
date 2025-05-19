import React,{CSSProperties} from 'react';
import { ClipLoader } from 'react-spinners';

interface LoaderProps {
    loading : boolean;
    color?: string;
    size?: number;
    center? : boolean;
}

const Loader: React.FC<LoaderProps > = ({loading, color = '#3498db', size=100, center = false}) => {
    const override: CSSProperties = center  ? {display : 'block', margin : '0 auto'}:  {display: 'block'};
  return (
   <ClipLoader
   color={color}
   loading= {loading}
   cssOverride={override}
    size={size}
    aria-label = "Loading Spinner"
    data-testid="loader"
   />
  )
}

export default Loader;