import { Chart } from "react-google-charts";

export default function AdminReport() {
  // ======= Dữ liệu giả =======
  const weeklyOrders = 12;
  const monthlyOrders = 48;
  const weeklyRevenue = 3500;
  const monthlyRevenue = 12000;
  const productsSoldWeek = 35;
  const productsSoldMonth = 120;

  // ======= Dữ liệu biểu đồ tuần =======
  const comboChartWeekData = [
    ["Ngày", "Sản phẩm bán", "Đơn hàng"],
    ["Thứ 2", 5, 2],
    ["Thứ 3", 6, 3],
    ["Thứ 4", 7, 4],
    ["Thứ 5", 4, 2],
    ["Thứ 6", 8, 5],
    ["Thứ 7", 5, 3],
    ["CN", 6, 4],
  ];
  const comboChartWeekOptions = {
    title: "Thống kê tuần này",
    vAxis: { title: "Số lượng" },
    hAxis: { title: "Ngày trong tuần" },
    seriesType: "bars",
    legend: { position: "bottom" },
  };

  const lineChartWeekData = [
    ["Ngày", "Doanh thu"],
    ["Thứ 2", 500],
    ["Thứ 3", 400],
    ["Thứ 4", 600],
    ["Thứ 5", 300],
    ["Thứ 6", 700],
    ["Thứ 7", 550],
    ["CN", 450],
  ];
  const lineChartWeekOptions = {
    title: "Doanh thu tuần (VNĐ)",
    hAxis: { title: "Ngày" },
    vAxis: { title: "Doanh thu" },
    legend: { position: "bottom" },
    curveType: "function",
  };

  const pieChartWeekData = [
    ["Trạng thái", "Số lượng"],
    ["Đã giao", 30],
    ["Đang xử lý", 10],
    ["Hủy", 8],
  ];
  const pieChartWeekOptions = {
    title: "Tỷ lệ đơn hàng tuần",
    pieHole: 0.4,
  };

  // ======= Dữ liệu biểu đồ tháng =======
  const comboChartMonthData = [
    ["Tháng", "Sản phẩm bán", "Đơn hàng"],
    ["1", 40, 20],
    ["2", 45, 25],
    ["3", 50, 30],
    ["4", 38, 28],
    ["5", 55, 35],
    ["6", 60, 40],
    ["7", 52, 30],
    ["8", 48, 32],
    ["9", 50, 35],
    ["10", 58, 38],
    ["11", 62, 40],
    ["12", 70, 45],
  ];
  const comboChartMonthOptions = {
    title: "Thống kê tháng",
    vAxis: { title: "Số lượng" },
    hAxis: { title: "Tháng" },
    seriesType: "bars",
    legend: { position: "bottom" },
  };

  const lineChartMonthData = [
    ["Tháng", "Doanh thu"],
    ["1", 1000],
    ["2", 1200],
    ["3", 1500],
    ["4", 1300],
    ["5", 1700],
    ["6", 1800],
    ["7", 1600],
    ["8", 1550],
    ["9", 1700],
    ["10", 1800],
    ["11", 1900],
    ["12", 2100],
  ];
  const lineChartMonthOptions = {
    title: "Doanh thu tháng (VNĐ)",
    hAxis: { title: "Tháng" },
    vAxis: { title: "Doanh thu" },
    legend: { position: "bottom" },
    curveType: "function",
  };

  const pieChartMonthData = [
    ["Trạng thái", "Số lượng"],
    ["Đã giao", 200],
    ["Đang xử lý", 50],
    ["Hủy", 20],
  ];
  const pieChartMonthOptions = {
    title: "Tỷ lệ đơn hàng tháng",
    pieHole: 0.4,
  };

  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        Báo Cáo Thống Kê 
      </h2>

      {/* ======= Tổng quan nhanh ======= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 shadow rounded bg-blue-50 text-center">
          <h4 className="font-semibold text-lg">Đơn hàng tuần</h4>
          <p className="text-2xl font-bold">{weeklyOrders}</p>
        </div>
        <div className="p-4 shadow rounded bg-green-50 text-center">
          <h4 className="font-semibold text-lg">Đơn hàng tháng</h4>
          <p className="text-2xl font-bold">{monthlyOrders}</p>
        </div>
        <div className="p-4 shadow rounded bg-yellow-50 text-center">
          <h4 className="font-semibold text-lg">Doanh thu tuần</h4>
          <p className="text-2xl font-bold">{weeklyRevenue}₫</p>
        </div>
        <div className="p-4 shadow rounded bg-purple-50 text-center">
          <h4 className="font-semibold text-lg">Doanh thu tháng</h4>
          <p className="text-2xl font-bold">{monthlyRevenue}₫</p>
        </div>
        <div className="p-4 shadow rounded bg-pink-50 text-center">
          <h4 className="font-semibold text-lg">Sản phẩm bán tuần</h4>
          <p className="text-2xl font-bold">{productsSoldWeek}</p>
        </div>
        <div className="p-4 shadow rounded bg-indigo-50 text-center">
          <h4 className="font-semibold text-lg">Sản phẩm bán tháng</h4>
          <p className="text-2xl font-bold">{productsSoldMonth}</p>
        </div>
      </div>

      {/* ======= Báo cáo tuần ======= */}
      <h3 className="text-center text-xl font-bold mb-2">Thống kê tuần</h3>
      <Chart
        chartType="ComboChart"
        width="100%"
        height="400px"
        data={comboChartWeekData}
        options={comboChartWeekOptions}
      />
      <Chart
        chartType="LineChart"
        width="100%"
        height="350px"
        data={lineChartWeekData}
        options={lineChartWeekOptions}
      />
      <Chart
        chartType="PieChart"
        width="100%"
        height="350px"
        data={pieChartWeekData}
        options={pieChartWeekOptions}
      />

      {/* ======= Báo cáo tháng ======= */}
      <h3 className="text-center text-xl font-bold my-4">Thống kê tháng</h3>
      <Chart
        chartType="ComboChart"
        width="100%"
        height="400px"
        data={comboChartMonthData}
        options={comboChartMonthOptions}
      />
      <Chart
        chartType="LineChart"
        width="100%"
        height="350px"
        data={lineChartMonthData}
        options={lineChartMonthOptions}
      />
      <Chart
        chartType="PieChart"
        width="100%"
        height="350px"
        data={pieChartMonthData}
        options={pieChartMonthOptions}
      />
    </div>
  );
}
