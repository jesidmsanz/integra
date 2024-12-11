import { ImagePath, ThemePrimary } from "@/Constant/constant";
import { useAppSelector } from "@/Redux/Hooks";
import { ApexOptions } from "apexcharts";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TableColumn } from "react-data-table-component";
import { Badge, FormGroup, Input, Label } from "reactstrap";

const IncomeOption = {
  series: [
    {
      name: "series2",
      data: [15, 25, 20, 35, 60, 30, 20, 30, 20, 35, 25, 20],
    },
  ],
  colors: [ThemePrimary, "#FFA941"],
  chart: {
    height: 95,
    type: "bar",
    sparkline: {
      enabled: true,
    },
  },
  tooltip: {
    enabled: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  plotOptions: {
    bar: {
      borderRadius: 3,
      distributed: true,
      columnWidth: "50%",
      barHeight: "38%",
      dataLabels: {
        position: "top",
      },
    },
  },
  responsive: [
    {
      breakpoint: 1700,
      options: {
        chart: {
          height: 86,
        },
      },
    },
    {
      breakpoint: 1699,
      options: {
        chart: {
          height: 95,
        },
      },
    },
    {
      breakpoint: 1460,
      options: {
        grid: {
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 5,
          },
        },
      },
    },
    {
      breakpoint: 376,
      options: {
        chart: {
          height: 50,
        },
      },
    },
  ],
};

const ExpenseOptions = {
  series: [
    {
      name: "Desktops",
      data: [
        50, 50, 50, 25, 25, 25, 2, 2, 2, 25, 25, 25, 62, 62, 62, 35, 35, 35, 66,
        66,
      ],
    },
  ],
  chart: {
    height: 100,
    type: "area",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: "#307EF3",
      opacity: 0.2,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  tooltip: {
    enabled: false,
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: "straight",
    width: 2,
  },
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 12,
        fillColor: "#307EF3",
        strokeColor: "#fff",
        size: 5,
        shape: "circle",
      },
    ],
  },
};

export const TotalEarningCardsData = [
  {
    id: 1,
    title: "Total Earning",
    rate: "20.790",
    lastWeek: 16.06,
    chart: {
      ...IncomeOption,
      series: IncomeOption.series,
      type: IncomeOption.chart?.type,
    },
  },
  {
    id: 2,
    title: "Total Expense",
    rate: "4683.90",
    lastWeek: 10.34,
    chart: {
      ...ExpenseOptions,
      series: ExpenseOptions.series,
      type: ExpenseOptions.chart?.type,
    },
  },
];

export const NewsUpdateData = [
  {
    id: 1,
    src: "1.jpg",
    title: "Indonesian Navy Lauds Mental Perseverance of Teenager...",
    spanText: "Today's News Headlines, Breaking...",
    time: 10,
  },
  {
    id: 2,
    src: "2.jpg",
    title: "Why now may be the 'golden age' for Southeast asia start-ups...",
    spanText: "Check out the latest news from...",
    time: 2,
  },
  {
    id: 3,
    src: "3.jpg",
    title: "China's renewed crypto crackdown wipes nearly $400...",
    spanText: "Technology and indian business news...",
    time: 14,
  },
  {
    id: 4,
    src: "4.jpg",
    title: "Indonesian Navy Lauds Mental Perseverance of Teenager...",
    spanText: "Today's News Headlines, Breaking...",
    time: 17,
  },
];

export const MonthlyDropdownList = ["Weekly", "Monthly", "Yearly"];

export const ProductOptions = {
  series: [
    {
      data: [10, 50, 80, 120, 160, 160],
    },
  ],
  chart: {
    type: "area",
    height: 350,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: "#307EF3",
      opacity: 0.2,
    },
  },
  xaxis: {
    categories: ["Mac", "iPhone", "Laptop", "Watch", "AirPords", "Headphone"],
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    curve: "stepline",
  },
  dataLabels: {
    enabled: false,
  },
  yaxis: {
    show: false,
  },
  grid: {
    show: false,
  },
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 3,
        fillColor: "#E16371",
        strokeColor: "#E16371",
        size: 6,
        shape: "circle",
      },
    ],
  },
  responsive: [
    {
      breakpoint: 1440,
      options: {
        chart: {
          height: 330,
        },
      },
    },
  ],
};

export const RecentOrders = [
  {
    id: 1,
    name: "Elle Amberson",
    orderNumber: "#Gh3649K",
    date: "15 Nov, 2022",
    time: "02:45 PM",
    product: "Wood Chair",
    price: "$152",
    status: "Paid",
  },
  {
    id: 2,
    name: "Anna Catmire",
    orderNumber: "#A5647KB",
    date: "25 Nov, 2022",
    time: "01:24 PM",
    product: "Men Sneakers",
    price: "$652",
    status: "Pending",
  },
  {
    id: 3,
    name: "Laura Dagson",
    orderNumber: "#KO093M",
    date: "26 Nov, 2022",
    time: "12:34 PM",
    product: "Tree Stylish",
    price: "$256",
    status: "Paid",
  },
  {
    id: 4,
    name: "Rachel Green",
    orderNumber: "#KMG403",
    date: "28 Nov, 2022",
    time: "10:27 PM",
    product: "Mi Watch",
    price: "$659",
    status: "Overdue",
  },
];

export const SalesOptions = {
  series: [65, 55, 40, 30],
  chart: {
    type: "donut",
    height: 300,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      donut: {
        size: "75%",
        labels: {
          show: true,
          name: {
            offsetY: -10,
          },
          value: {
            offsetY: -50,
          },
          total: {
            show: true,
            fontSize: "14px",
            fontFamily: "Outfit",
            fontWeight: 400,
            label: "Total",
            color: "#9B9B9B",
            formatter: (w) => "45.764",
          },
        },
      },
      customScale: 1,
      offsetX: 0,
    },
  },
  grid: {
    padding: {
      bottom: -120,
    },
  },
  colors: ["#307EF3", "#EBA31D", "#DC3545", "#53a653"],
  responsive: [
    {
      breakpoint: 1660,
      options: {
        chart: {
          height: 280,
        },
      },
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 250,
        },
      },
    },
  ],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
};

export const CustomerCardData = [
  {
    id: 1,
    divClass: "col-xxl-3 col-xl-50 col-sm-6 proorder-xl-2",
    color: "primary",
    title: "Customers",
    rate: "1.485",
    icon: "male",
    percent: 4.6,
  },
  {
    id: 2,
    divClass: "col-xxl-3 col-xl-50 col-sm-6 proorder-xl-3",
    bodyClass: "money",
    color: "secondary",
    title: "Revenue",
    rate: "$5.873",
    icon: "money",
    percent: 3.1,
  },
  {
    id: 3,
    divClass: "col-xxl-3 col-xl-50 col-sm-6 proorder-xl-4",
    bodyClass: "profit",
    color: "danger",
    title: "Profit",
    rate: "70%",
    icon: "profile",
    percent: 2.3,
  },
  {
    id: 4,
    divClass: "col-xxl-3 col-xl-50 col-sm-6 proorder-xl-5",
    bodyClass: "invoice-profit",
    color: "success",
    title: "Invoices",
    rate: "1.256",
    icon: "invoice",
    percent: 6.3,
  },
];

export const ReviewSliderOptions = {
  dots: true,
  infinite: true,
  speed: 500,
  AutoPlay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
  pauseOnHover: true,
};

export const ReviewSliderData = [
  {
    id: 1,
    src: "14.png",
    title: "John Connor",
    rate: 4.3,
    rate2: 136,
  },
  {
    id: 2,
    src: "20.png",
    title: "Paul Miller",
    rate: 5.6,
    rate2: 120,
  },
  {
    id: 1,
    src: "21.png",
    title: "Alen Lee",
    rate: 6.3,
    rate2: 140,
  },
];

export const SalesOverviewOptions = {
  series: [
    {
      name: "TEAM A",
      type: "area",
      data: [183, 175, 170, 178, 185, 171, 177, 185, 170, 180, 175, 170],
    },
    {
      name: "TEAM B",
      type: "line",
      data: [183, 193, 170, 182, 200, 180, 185, 178, 165, 175, 190, 190],
    },
  ],
  chart: {
    height: 288,
    type: "line",
    stacked: false,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: "smooth",
    width: [3, 3],
    dashArray: [0, 4],
  },
  grid: {
    show: true,
    borderColor: "#000000",
    strokeDashArray: 0,
    position: "back",
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 2,
        fillColor: "#fff",
        strokeColor: "#000",
        size: 7,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 4,
        fillColor: "#fff",
        strokeColor: "#000",
        size: 7,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 6,
        fillColor: "#fff",
        strokeColor: "#000",
        size: 7,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 9,
        fillColor: "#fff",
        strokeColor: "#000",
        size: 7,
        shape: "circle",
      },
    ],
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " points";
        }
        return y;
      },
    },
  },
  legend: {
    show: false,
  },
  colors: ["#307EF3", "#EAEAEA"],
  fill: {
    type: ["gradient", "solid", "gradient"],
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 1,
      gradientToColors: ["#307EF3", "#fff5f7", "#307EF3"],
      inverseColors: true,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100, 100, 100],
    },
  },
  xaxis: {
    labels: {
      style: {
        fontFamily: "Outfit, sans-serif",
        fontWeight: 500,
        colors: "#8D8D8D",
      },
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1440,
      options: {
        chart: {
          height: 220,
        },
      },
    },
  ],
};

export const ActiveTasksData = [
  {
    id: 1,
    title: "Regina Cooper",
    text: "Create userflow social application design",
  },
  {
    id: 2,
    title: "Install Appointment",
    text: "Homepage design for slimmuch product",
  },
  {
    id: 3,
    title: "Regina Cooper",
    text: "Interactive prototype design - web design",
  },
  {
    id: 4,
    title: "Regina Cooper",
    text: "Create Application design for topbuzz",
  },
];

export const InvestmentOptions = {
  series: [100, 10, 30, 40],
  chart: {
    type: "donut",
    height: 200,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 1500,
      options: {
        chart: {
          height: 180,
        },
      },
    },
    {
      breakpoint: 1441,
      options: {
        chart: {
          height: 200,
        },
      },
    },
  ],
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: "70%",
        labels: {
          show: true,
          value: {
            offsetY: 5,
          },
          total: {
            show: true,
            fontSize: "14px",
            color: "#9B9B9B",
            fontFamily: "Outfit', sans-serif",
            fontWeight: 400,
            label: "Total",
            formatter: () => "$ 9,8373",
          },
        },
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val / 100 + "$";
      },
    },
  },
  colors: ["#307EF3", "#F3F3F3", "#DC3545", "#EBA31D"],
};

export const TotalInvestmentData = [
  { text: "Total", rate: " 5,8272" },
  { text: "Monthly", rate: " 6,2456" },
  { text: "Daily", rate: " 5,8704" },
];

export const LeadsStatusData = [
  {
    id: 1,
    child: [
      { id: 1, text: "Customers" },
      { id: 2, text: "Lena Smith", class: "border-3 b-l-primary" },
      { id: 3, text: "Nicol Green", class: "border-3 b-l-secondary" },
      { id: 4, text: "Tom Taylor", class: "border-3 b-l-danger mb-0" },
    ],
  },
  {
    id: 2,
    child: [
      { id: 1, text: "Last Contacted" },
      { id: 2, text: "June 14, 2024" },
      { id: 3, text: "June 16, 2024" },
      { id: 4, text: "June 18, 2024", class: "mb-0" },
    ],
  },
  {
    id: 3,
    child: [
      { id: 1, text: "Sales Rep" },
      { id: 2, image: "2.png", text: "Paul Miller" },
      { id: 3, image: "1.png", text: "Alen Lee" },
      { id: 4, class: "mb-0", image: "3.png", text: "Lucy White" },
    ],
  },
  {
    id: 4,
    child: [
      { id: 1, text: "Status" },
      { id: 2, class: "bg-light-primary font-primary", text: "Deal Won" },
      { id: 3, class: "bg-light-secondary font-secondary", text: "Intro Call" },
      { id: 4, class: "bg-light-danger font-danger mb-0", text: "Stuck" },
    ],
  },
  {
    id: 5,
    child: [
      { id: 1, text: "Deal Value" },
      { id: 2, text: "$ 200.2k" },
      { id: 3, text: "$210k" },
      { id: 4, class: "mb-0", text: "$70k" },
    ],
  },
];

export const NotificationCardData = [
  {
    id: 1,
    image: "15.png",
    title: "Paul Svensson invite you Prototyping",
    text: "05 April, 2024 | 03:00 PM",
  },
  {
    id: 2,
    image: "16.png",
    title: "Adam Nolan mentioned you in UX Basics",
    text: "04 April, 2024 | 05:00 PM",
  },
  {
    id: 3,
    image: "17.png",
    title: "Paul Morgan Commented in UI Design",
    text: "05 April, 2024 | 02:00 PM",
  },
  {
    id: 4,
    image: "18.png",
    title: "Robert Babinski Said nothing important",
    text: "01 April, 2024 | 06:00 PM",
  },
];

export const OnlineOptions = {
  series: [
    {
      name: "Activity",
      data: [42, 44, 55, 66, 55, 86, 52, 44, 44, 66, 55, 86, 52, 44, 44],
    },
  ],
  chart: {
    height: 100,
    type: "bar",
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 3,
      columnWidth: "40%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  colors: [
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#307EF3",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
    "#d6e5fd",
  ],
};

export const OfflineOptions = {
  series: [
    {
      name: "Desktops",
      data: [
        50, 50, 50, 25, 25, 25, 2, 2, 2, 25, 25, 25, 62, 62, 62, 35, 35, 35, 66,
        66,
      ],
    },
  ],
  chart: {
    type: "area",
    offsetY: 30,
    height: 140,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: "#EBA31D",
      opacity: 0.2,
    },
  },
  colors: ["#EBA31D"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: "straight",
    width: 2,
  },
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 12,
        fillColor: "#EBA31D",
        strokeColor: "#fff",
        size: 5,
        shape: "circle",
      },
    ],
  },
  responsive: [
    {
      breakpoint: 1661,
      options: {
        chart: {
          height: 140,
        },
      },
    },
  ],
};

export const RevenueOptions = {
  series: [
    {
      name: "Desktops",
      data: [15, 14, 11, 20, 10, 15, 11],
    },
  ],
  chart: {
    type: "area",
    height: 120,
    offsetY: 10,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: "#DC3545",
      opacity: 0.2,
    },
  },
  colors: ["#DC3545"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.2,
      stops: [0, 100, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 3,
        fillColor: "#DC3545",
        strokeColor: "#fff",
        size: 6,
        shape: "circle",
      },
    ],
  },
};

export const OnlineOrderCardData = [
  {
    id: 1,
    colClass: "col-xl-33 ps-0",
    headerClass: "pb-0",
    color: "primary",
    icon: "basket",
    arrowColor: "danger",
    percent: "-6.3",
    text: "Online Order",
    rate: "16,2873",
    chart: {
      ...OnlineOptions,
      series: OnlineOptions.series,
      height: OnlineOptions.chart?.height,
    },
  },
  {
    id: 2,
    colClass: "col-xl-33 pedding-sm",
    headerClass: "offline-order",
    color: "secondary",
    icon: "delivery",
    arrowColor: "success",
    percent: "+8.3",
    text: "Offline Order",
    rate: "62,5461",
    chart: {
      ...OfflineOptions,
      series: OfflineOptions.series,
      height: OfflineOptions.chart?.height,
    },
    chartClass: "offline-chart",
  },
  {
    id: 3,
    colClass: "col-xl-33 pedding-end pedding-sm-start pedding-sm",
    headerClass: "revenue-order pb-0",
    color: "danger",
    icon: "increased",
    arrowColor: "danger",
    percent: "-3.5",
    text: "Total Revenue",
    rate: "45,9561",
    chart: {
      ...RevenueOptions,
      series: RevenueOptions.series,
      height: RevenueOptions.chart?.height,
    },
    chartClass: "revenue",
  },
];

export const SaleTopCountriesData = [
  {
    id: 1,
    child: [
      {
        id: 1,
        title: "China",
        percent: 90,
      },
      {
        id: 2,
        title: "Hong Kong",
        percent: 70,
      },
    ],
  },
  {
    id: 2,
    child: [
      {
        id: 1,
        title: "Great Britain",
        percent: 60,
      },
      {
        id: 2,
        class: "me-3",
        title: "Australia",
        percent: 50,
      },
    ],
  },
];

const WorldPosition = { lat: 50, lng: 10 };

export const WorldMapProps = {
  center: WorldPosition,
  zoom: 2,
  maxZoom: 10,
  attributionControl: true,
  zoomControl: true,
  doubleClickZoom: true,
  scrollWheelZoom: true,
  dragging: true,
  easeLinearity: 0.35,
};

export const EarnedOptions = {
  series: [
    {
      name: "Desktops",
      data: [50, 50, 50, 25, 25, 25, 2, 2, 2, 25, 25, 25, 62, 62],
    },
  ],
  chart: {
    type: "area",
    height: 200,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: "#307EF3",
      opacity: 0.2,
    },
  },
  colors: ["#307EF3"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.2,
      stops: [0, 100, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
};

export const CategoriesOptions = {
  series: [52, 35, 15, 45],
  chart: {
    type: "donut",
    height: 200,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 1700,
      options: {
        chart: {
          height: 150,
        },
      },
    },
    {
      breakpoint: 1441,
      options: {
        chart: {
          height: 205,
        },
      },
    },
    {
      breakpoint: 421,
      options: {
        chart: {
          height: 170,
        },
      },
    },
  ],
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: "70%",
        labels: {
          show: true,
          value: {
            offsetY: 5,
          },
          total: {
            show: true,
            fontSize: "14px",
            color: "#9B9B9B",
            fontFamily: "Outfit', sans-serif",
            fontWeight: 400,
            label: "Total",
            formatter: () => "60%",
          },
        },
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val / 100 + "$";
      },
    },
  },
  colors: ["#307EF3", "#DC3545", "#F3F3F3", "#EBA31D"],
};

export const CategoriesSalesData = [
  {
    id: 1,
    color: "primary",
    title: "Income",
    rate: "21,654",
  },
  {
    id: 2,
    color: "secondary",
    title: "Visitors",
    rate: "62,842",
  },
  {
    id: 3,
    color: "danger",
    title: "Expense",
    rate: "37,210",
  },
];

export const TotalProjectOptions = {
  series: [
    {
      name: "Web App Design",
      data: [150, 100, 100, 100, 70, 70, 70, 270, 50, 100],
    },
    {
      name: "Website Design",
      data: [320, 210, 290, 200, 230, 230, 230, 350, 230, 300],
    },
    {
      name: "App Design",
      data: [150, 165, 165, 165, 280, 155, 155, 140, 170, 130],
    },
  ],
  colors: ["#307EF3", "#78A6ED", "#4F5875"],
  chart: {
    type: "bar",
    height: 320,
    stacked: true,
    toolbar: {
      show: false,
      tools: {
        download: false,
      },
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 1661,
      options: {
        chart: {
          height: 340,
        },
      },
    },
  ],
  grid: {
    strokeDashArray: 3,
    position: "back",
    row: {
      opacity: 0.5,
    },
    column: {
      opacity: 0.5,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "20%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
    ],
    labels: {
      style: {
        fontFamily: "Outfit, sans-serif",
        fontWeight: 500,
        colors: "#8D8D8D",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontFamily: "Outfit, sans-serif",
        fontWeight: 500,
        colors: "#8D8D8D",
      },
    },
  },
  legend: {
    show: false,
  },
  fill: {
    opacity: 1,
  },
};

export const OrderOverviewData = [
  {
    id: 1,
    value: 40,
    text: "Online Order",
    color: "primary",
  },
  {
    id: 2,
    value: 60,
    text: "Offline Order",
    color: "secondary",
  },
  {
    id: 3,
    value: 20,
    text: "Cash On Develery",
    color: "danger",
  },
];

export const MonthlyGrowthOptions = {
  series: [
    {
      name: "Growth",
      data: [0, 14, 5, 20, 14, 30],
    },
  ],
  chart: {
    height: 120,
    type: "line",
    stacked: true,
    offsetY: 40,
    toolbar: {
      show: false,
    },
  },
  grid: {
    show: false,
    borderColor: "#000000",
    strokeDashArray: 0,
    position: "back",
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  colors: ["#307EF3"],
  stroke: {
    width: 3,
    curve: "smooth",
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: -10,
    max: 40,
    labels: {
      show: false,
    },
  },
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 0,
        fillColor: "#307EF3",
        strokeColor: "#307EF3",
        size: 4,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 1,
        fillColor: "#307EF3",
        strokeColor: "#307EF3",
        size: 4,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 2,
        fillColor: "#307EF3",
        strokeColor: "#307EF3",
        size: 4,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 3,
        fillColor: "#307EF3",
        strokeColor: "#307EF3",
        size: 4,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 4,
        fillColor: "#307EF3",
        strokeColor: "#307EF3",
        size: 4,
        shape: "circle",
      },
      {
        seriesIndex: 0,
        dataPointIndex: 5,
        fillColor: "#fff",
        strokeColor: "#307EF3",
        size: 5,
        shape: "circle",
      },
    ],
  },
};

export const RecentActivityData = [
  {
    id: 2,
    src: "6.png",
    dateTime: "5 hrs Ago",
    paragraph:
      "That is the key of this collection, being yourself.Don't be into trends.",
  },
  {
    id: 3,
    dateTime: "25 Oct,2022",
  },
  {
    id: 4,
    src: "7.png",
    dateTime: "12 hrs Ago",
    paragraph:
      "I am no longer concerned with sensation and innovation, but with the perfection my style.",
  },
  {
    id: 5,
    src: "8.png",
    dateTime: "12:00 pm",
    paragraph:
      "You have added new product in Clothe  text of the Printing and tyesetting industry.",
  },
];

export const NewCustomersTableData = [
  {
    id: 1,
    src: "9.png",
    name: "Selena Wagner",
    mail: "@selena.oi",
    brand: "iPhone 14 Pro",
    date: "Oct 24, 2024",
    price: 239,
  },
  {
    id: 2,
    src: "10.png",
    name: "Walter Reuter",
    mail: "@walter.me",
    brand: "Stylish Watches",
    date: "Sep 16, 2024",
    price: 326,
  },
  {
    id: 3,
    src: "11.png",
    name: "Leopold Ebert",
    mail: "@larissa.gb",
    brand: "Rocky Shoes",
    date: "Dec 20, 2024",
    price: 985,
  },
];

export const DiscountSliderOptions = {
  dots: true,
  AutoPlay: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
};

export const DiscountCardData = [
  {
    id: 1,
    brand: "IPhone 14 Pro",
    discount: 21.45,
    price: 65.4,
    deal: 48,
    time: [
      { id: 1, digit: 28, text: "Days" },
      { id: 2, digit: 3, text: "Hours" },
      { id: 3, digit: 14, text: "Min" },
      { id: 4, digit: 45, text: "Sec" },
    ],
    image: "7.png",
  },
  {
    id: 2,
    brand: "Apple Airpods",
    discount: 20.35,
    price: 35.43,
    deal: 38,
    time: [
      { id: 1, digit: 20, text: "Days" },
      { id: 2, digit: 5, text: "Hours" },
      { id: 3, digit: 30, text: "Min" },
      { id: 4, digit: 15, text: "Sec" },
    ],
    image: "8.png",
  },
  {
    id: 3,
    brand: "Apple Watch Series 7",
    discount: 25.3,
    price: 45.4,
    deal: 25,
    time: [
      { id: 1, digit: 15, text: "Days" },
      { id: 2, digit: 6, text: "Hours" },
      { id: 3, digit: 18, text: "Min" },
      { id: 4, digit: 30, text: "Sec" },
    ],
    image: "9.png",
  },
];

export const RecentOrderData = [
  {
    productName: "Rocky Shoes",
    productCode: "#Gh3649K",
    customerName: "Rocky Shoes",
    customerAddress: "White Crater",
    date: "Oct 24, 2024",
    status: "Paid",
    statusClass: "bg-light-primary txt-primary",
    total: "$21.56",
    image: "1",
  },
  {
    productName: "iPhone 14 Pro",
    productCode: "#A5647KB",
    customerName: "iPhone 14 Pro",
    customerAddress: "World Bandung",
    date: "Nov 13, 2024",
    status: "Pending",
    statusClass: "bg-light-secondary txt-secondary",
    total: "$65.36",
    image: "2",
  },
  {
    productName: "Stylish Watches",
    productCode: "#KO093M",
    customerName: "Stylish Watches",
    customerAddress: "Jalan Braga",
    date: "Sep 16, 2024",
    status: "Paid",
    statusClass: "bg-light-primary txt-primary",
    total: "$95.48",
    image: "3",
  },
  {
    productName: "Laptop Backpack",
    productCode: "#KMG403",
    customerName: "Rachel Green",
    customerAddress: "Gedung Sate",
    date: "Dec 20, 2024",
    status: "Overdue",
    statusClass: "bg-light-danger txt-danger",
    total: "$95.78",
    image: "4",
  },
];

export const WebCardData = [
  {
    id: 1,
    md: 6,
    color: "primary",
    icon: "improvement",
    title: "Web & mobile app",
    text: "Dribble Presentation",
    comment: [
      { id: 1, icon: "calendar", spanText: "June 18,2024" },
      { id: 2, icon: "message", spanText: "18" },
      { id: 3, icon: "link", spanText: "08" },
    ],
    customers: [
      { id: 1, image: "1.png" },
      { id: 2, image: "2.png" },
      { id: 3, image: "3.png" },
    ],
    progressValue: 70,
  },
  {
    id: 2,
    md: 6,
    divClass: "nft-card",
    color: "success",
    icon: "NFT",
    title: "NFT website design",
    text: "Pinterest Promotion",
    comment: [
      { id: 1, icon: "calendar", spanText: "June 15,2024" },
      { id: 2, icon: "message", spanText: "20" },
      { id: 3, icon: "link", spanText: "10" },
    ],
    customers: [
      { id: 1, image: "8.png" },
      { id: 2, image: "4.png" },
      { id: 3, image: "7.png" },
    ],
    progressValue: 60,
  },
  {
    id: 3,
    md: 12,
    divClass: "twitter-card",
    color: "danger",
    icon: "management",
    title: "Project dashboard",
    text: "Twitter Marketing",
    comment: [
      { id: 1, icon: "calendar", spanText: "June 25,2024" },
      { id: 2, icon: "message", spanText: "30" },
      { id: 3, icon: "link", spanText: "12" },
    ],
    customers: [
      { id: 1, image: "9.png" },
      { id: 2, image: "5.png" },
      { id: 3, image: "6.png" },
    ],
    progressValue: 50,
  },
];

export const ProjectTableData = [
  {
    memberName: "Elle Amberson",
    role: "Developer",
    projectType: "UI/UX Designer",
    startDate: "Nov 4,2024",
    endDate: "Dec 20,2024",
    progress: 50,
    status: "Paid",
    color: "primary",
    statusClass: "bg-light-primary txt-primary",
  },
  {
    memberName: "Anna Catmire",
    role: "Designer",
    projectType: "Website Design",
    startDate: "Feb 20,2024",
    endDate: "Nov 7,2024",
    progress: 50,
    status: "Pending",
    color: "warning",
    statusClass: "bg-light-secondary txt-secondary",
  },
  {
    memberName: "Laura Dagson",
    role: "Developer",
    projectType: "Landing Page",
    startDate: "Nov 4,2024",
    endDate: "Dec 20,2024",
    progress: 50,
    status: "Paid",
    color: "primary",
    statusClass: "bg-light-primary txt-primary",
  },
  {
    memberName: "Rachel Green",
    role: "Designer",
    projectType: "Marketing",
    startDate: "Oct 8, 2024",
    endDate: "Dec 10,2024",
    progress: 50,
    status: "Overdue",
    color: "danger",
    statusClass: "bg-light-danger txt-danger",
  },
];

export const BudgetCardData = [
  {
    id: 1,
    color: "primary",
    icon: "design",
    title: "Design",
    price: " 35,842.00",
  },
  {
    id: 2,
    color: "secondary",
    icon: "development",
    iconClass: "ms-1",
    title: "Development",
    price: " 5,647.00",
  },
  {
    id: 3,
    color: "danger",
    icon: "other",
    iconClass: "mt-2",
    title: "Others",
    price: " 3,237.00",
  },
];

export const BudgetOptions = {
  series: [
    {
      name: "Desktops",
      data: [15, 14, 11, 20, 10, 15, 11],
    },
  ],
  chart: {
    type: "area",
    height: 120,
    offsetY: 10,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      blur: 2,
      color: "#307EF3",
      opacity: 0.2,
    },
  },
  colors: ["#307EF3"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.2,
      stops: [0, 100, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  markers: {
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 3,
        fillColor: "#307EF3",
        strokeColor: "#fff",
        size: 6,
        shape: "circle",
      },
    ],
  },
};

export const ProjectOptions = {
  series: [
    {
      name: "TEAM A",
      type: "column",
      data: [
        220, 0, 250, 0, 210, 0, 210, 0, 270, 0, 220, 0, 250, 0, 260, 0, 210, 0,
        230,
      ],
    },
    {
      name: "TEAM B",
      type: "area",
      data: [
        210, 90, 240, 100, 200, 120, 200, 80, 260, 120, 210, 90, 240, 100, 250,
        40, 200, 40, 220, 220,
      ],
    },
  ],
  chart: {
    height: 355,
    type: "area",
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: [0, 2, 5],
    curve: "stepline",
  },
  plotOptions: {
    bar: {
      columnWidth: "35px",
    },
  },
  colors: ["#bebebe", "#307EF3"],
  dropShadow: {
    enabled: true,
    top: 5,
    left: 6,
    bottom: 5,
    blur: 2,
    color: "#307EF3",
    opacity: 0.5,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  grid: {
    show: true,
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "",
      "feb",
      "",
      "Mar",
      "",
      "Apr",
      "",
      "May",
      "",
      "Jun",
      "",
      "July",
      "",
      "Aug",
      "",
      "Sep",
      "",
      "Oct",
      "",
    ],
    labels: {
      style: {
        fontFamily: "Outfit, sans-serif",
        fontWeight: 500,
        colors: "#8D8D8D",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  yaxis: {
    labels: {
      style: {
        fontFamily: "Outfit, sans-serif",
        fontWeight: 500,
        colors: "#8D8D8D",
      },
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex }) {
      return (
        '<div class="apex-tooltip p-2">' +
        "<span>" +
        '<span class="bg-primary">' +
        "</span>" +
        "Project Created" +
        "<h3>" +
        "$" +
        series[seriesIndex][dataPointIndex] +
        "<h3/>" +
        "</span>" +
        "</div>"
      );
    },
  },
};

export const TodayTasksHead = [
  { name: "Task Name" },
  { name: "Clients" },
  { name: "Deadline" },
];

export const TodayTasksTable = [
  {
    id: 1,
    paragraph: "Wireframes for  mobile app on rails platform",
    customers: [
      { id: 1, image: "14.png" },
      { id: 2, image: "15.png" },
      { id: 3, image: "16.png" },
    ],
    date: "Nov 14,2024",
  },
  {
    id: 2,
    paragraph: "Update the stakehoders with ne strategy",
    customers: [
      { id: 1, image: "17.png" },
      { id: 2, image: "3.png" },
      { id: 3, image: "7.png" },
    ],
    date: "Apr 12,2024",
  },
  {
    id: 3,
    paragraph: "Send key stakeholders update pricing guides",
    customers: [
      { id: 1, image: "12.png" },
      { id: 2, image: "18.png" },
      { id: 3, image: "19.png" },
    ],
    date: "Nov 4,2024",
  },
  {
    id: 4,
    paragraph: "Add icons sprite sheet new marketing website",
    customers: [
      { id: 1, image: "13.png" },
      { id: 2, image: "3.png" },
      { id: 3, image: "11.png" },
    ],
    date: "Dec 20,2024",
  },
];

export const ProgressOptions = {
  series: [75],
  chart: {
    height: 300,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "55%",
      },
    },
  },
  responsive: [
    {
      breakpoint: 1661,
      options: {
        chart: {
          height: 280,
        },
      },
    },
    {
      breakpoint: 1581,
      options: {
        chart: {
          height: 250,
        },
      },
    },
    {
      breakpoint: 1471,
      options: {
        chart: {
          height: 242,
        },
      },
    },
    {
      breakpoint: 1441,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1301,
      options: {
        chart: {
          height: 250,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1140,
      options: {
        chart: {
          height: 250,
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 821,
      options: {
        chart: {
          height: 270,
        },
      },
    },
  ],
  colors: ["#307EF3"],
  labels: ["Progress"],
};

export const PendingProjectData = [
  {
    id: 1,
    title: "5 ",
    text: "In Progress",
    percent: "+ 26.28",
    color: "primary",
    icon: "danger",
  },
  {
    id: 2,
    title: "10 ",
    text: "Completed",
    percent: "- 46.28",
    color: "secondary",
    icon: "check",
  },
  {
    id: 3,
    title: "24 ",
    text: "Total",
    percent: "+ 36.28",
    color: "danger",
    icon: "stroke-charts",
  },
];

export const RedesignCardData = [
  {
    id: 1,
    title: "Brooklyn Simmons",
    text: "Redesign kripton mobile app",
    date: "Jan 10,2024",
    iconClass: "deadline",
    dayDate: "Tuesday, Sep 20th 2024",
  },
  {
    id: 2,
    title: "Anna Catmireo",
    text: "Business app landing page",
    date: "Dec 19,2024",
    iconClass: "bussiness-app",
    dayDate: "Monday, Dec 10th 2024",
  },
  {
    id: 3,
    title: "Laurs Dargerta",
    text: "NFT web landing page",
    date: "Dec 19,2024",
    iconClass: "nft-web",
    dayDate: "Tuesday, May 20th 2024",
  },
];

export const ProjectRadarChart = {
  series: [
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100, 20],
    },
    {
      name: "Series 2",
      data: [20, 30, 40, 80, 20, 80],
    },
    {
      name: "Series 3",
      data: [45, 75, 80, 10, 40, 10],
    },
  ],
  colors: ["#307EF3", "#51bb25", "#EBA31D"],
  chart: {
    height: 270,
    type: "radar",
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1,
    },
    toolbar: {
      show: false,
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["#307EF3", "#51bb25", "#EBA31D"],
    dashArray: 0,
  },
  markers: {
    size: 0,
  },
  labels: ["1", "2", "3", "4", "5", "6"],
};
