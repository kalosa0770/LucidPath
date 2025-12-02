import React, { useEffect, useState } from 'react';

// Lightweight wrapper that dynamically imports chart.js + react-chartjs-2
// This avoids bundling the chart libraries into the initial app bundle.
const ChartLazy = ({ data, options }) => {
  const [LineComp, setLineComp] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // dynamically import react-chartjs-2 Line and register chart.js auto
      const [{ Line }, ChartJS] = await Promise.all([
        import('react-chartjs-2'),
        import('chart.js/auto'),
      ]);

      // set component to render
      if (mounted) setLineComp(() => Line);
    })();

    return () => { mounted = false; };
  }, []);

  if (!LineComp) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-dark">Loading chart...</div>
    );
  }

  return <LineComp data={data} options={options} />;
};

export default ChartLazy;
