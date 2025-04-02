import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.fullscreen ? 'calc(100vh - 200px)' : '400px'};
  padding: 1rem;
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.md};
  transition: height 0.3s ease;
`

const TableContainer = styled.div`
  width: 100%;
  height: ${props => props.fullscreen ? 'calc(100vh - 200px)' : '400px'};
  overflow-y: auto;
  padding: 1rem;
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.md};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.grayDark};
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.backgroundLight};
  }

  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
  }
`

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.grayDark};
  color: ${props => props.theme.colors.text};
`

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.textMuted};
  font-size: 1.1rem;
`

/**
 * Chart component that renders different types of charts
 */
const Chart = ({ 
  type = 'bar', 
  data, 
  options = {}, 
  fullscreen = false 
}) => {
  const { theme } = useTheme()
  const chartRef = useRef(null)

  // Set chart theme options
  useEffect(() => {
    // Set global default styles for all charts
    ChartJS.defaults.color = theme.colors.text;
    ChartJS.defaults.borderColor = theme.colors.grayDark;
    ChartJS.defaults.font.family = theme.fonts.body;
    
    // Update the chart when theme changes
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [theme]);

  // Default options with theme-aware styling
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        labels: {
          color: theme.colors.text,
          font: {
            family: theme.fonts.body,
          },
        },
      },
      tooltip: {
        backgroundColor: theme.colors.backgroundLighter,
        titleColor: theme.colors.primary,
        bodyColor: theme.colors.text,
        borderColor: theme.colors.grayDark,
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        cornerRadius: 8,
        titleFont: {
          family: theme.fonts.heading,
          weight: 'bold',
        },
        bodyFont: {
          family: theme.fonts.body,
        },
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        grid: {
          color: theme.colors.grayDark,
        },
        ticks: {
          color: theme.colors.text,
        },
      },
      y: {
        grid: {
          color: theme.colors.grayDark,
        },
        ticks: {
          color: theme.colors.text,
        },
      },
    } : undefined,
  };
  
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  // Handle when no data is available
  if (!data || !data.labels || !data.datasets) {
    return (
      <ChartContainer theme={theme} fullscreen={fullscreen}>
        <NoDataMessage theme={theme}>
          No chart data available. Try asking for a visualization in the chat.
        </NoDataMessage>
      </ChartContainer>
    );
  }

  // Render table view
  if (type === 'table') {
    // Extract data for table
    const headers = data.labels;
    const tableData = data.labels.map((label, index) => {
      const row = { label };
      
      data.datasets.forEach(dataset => {
        row[dataset.label || 'Value'] = dataset.data[index];
      });
      
      return row;
    });

    return (
      <TableContainer theme={theme} fullscreen={fullscreen}>
        <Table>
          <thead>
            <tr>
              <TableHeader theme={theme}>Label</TableHeader>
              {data.datasets.map((dataset, index) => (
                <TableHeader key={index} theme={theme}>
                  {dataset.label || 'Value'}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex} theme={theme}>
                <TableCell theme={theme}>{row.label}</TableCell>
                {data.datasets.map((dataset, datasetIndex) => (
                  <TableCell key={datasetIndex} theme={theme}>
                    {dataset.data[rowIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
  }

  // Handle area chart (extension of line chart)
  if (type === 'area') {
    // Modify line chart data for area chart
    const areaData = {
      ...data,
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        fill: true,
        backgroundColor: `${dataset.borderColor}40`, // Add transparency
      })),
    };

    return (
      <ChartContainer theme={theme} fullscreen={fullscreen}>
        <Line 
          ref={chartRef}
          data={areaData} 
          options={mergedOptions} 
        />
      </ChartContainer>
    );
  }

  // Render the appropriate chart type
  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
  }[type] || Bar;

  return (
    <ChartContainer theme={theme} fullscreen={fullscreen}>
      <ChartComponent 
        ref={chartRef}
        data={data} 
        options={mergedOptions} 
      />
    </ChartContainer>
  );
};

export default Chart;