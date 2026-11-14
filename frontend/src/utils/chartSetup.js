import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

// Match the app's light theme in every chart
ChartJS.defaults.font.family = '"Plus Jakarta Sans", sans-serif';
ChartJS.defaults.color = "#8b8b8b"; // axis labels
ChartJS.defaults.borderColor = "#efeee9"; // grid lines
