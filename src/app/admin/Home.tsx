"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PurchaseDetailResType,
  PurchasesResType,
} from "../schemaValidations/purchase.schema";
import { InvoicesResType } from "../schemaValidations/invoice.schema";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { OrdersResType } from "../schemaValidations/order.schema";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../app-provider";
import authApiRequest from "../apiRequest/auth";
import { subDays } from "date-fns/subDays";

// thống kê thu nhập, chi tiêu và chưa thanh toán
const calculateTotals = (
  invoices: InvoicesResType["data"] | null,
  purchaseDetails: PurchaseDetailResType["data"] | null,
  purchases: PurchasesResType["data"] | null
) => {
  const totals = {
    daily: {} as Record<
      string,
      {
        income: number;
        expense: number;
        unpaidInvoicesAmount: number;
        unpaidInvoicesCount: number;
      }
    >,
  };

  invoices?.forEach((invoice) => {
    const zonedDate = toZonedTime(
      new Date(invoice.createdDate),
      "Asia/Ho_Chi_Minh"
    );
    const day = format(startOfDay(zonedDate), "yyyy-MM-dd");

    if (!totals.daily[day]) {
      totals.daily[day] = {
        income: 0,
        expense: 0,
        unpaidInvoicesAmount: 0,
        unpaidInvoicesCount: 0,
      };
    }

    if (invoice.paymentStatus === 1) {
      totals.daily[day].income += invoice.totalPrice;
    } else {
      totals.daily[day].unpaidInvoicesAmount += invoice.totalPrice;
      totals.daily[day].unpaidInvoicesCount += 1;
    }
  });

  purchaseDetails?.forEach((detail) => {
    const purchase = purchases?.find(
      (p) => p.purchaseId === detail.id.purchaseId
    );
    if (!purchase) return;

    const zonedDate = toZonedTime(
      new Date(purchase.dateCreate),
      "Asia/Ho_Chi_Minh"
    );
    const day = format(startOfDay(zonedDate), "yyyy-MM-dd");

    const expense = detail.amount * detail.priceIncome;

    if (!totals.daily[day]) {
      totals.daily[day] = {
        income: 0,
        expense: 0,
        unpaidInvoicesAmount: 0,
        unpaidInvoicesCount: 0,
      };
    }

    totals.daily[day].expense += expense;
  });

  return totals;
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dates = [];
  let currentDate = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (currentDate <= end) {
    dates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Thống kê đơn hàng
const calculateOrderTotals = (orders: OrdersResType["data"] | null) => {
  const totals = {
    daily: {} as Record<
      string,
      {
        [key: number]: number; // Đếm số lượng đơn hàng theo trạng thái
      }
    >,
  };

  orders?.forEach((order) => {
    const zonedDate = toZonedTime(
      new Date(order.orderDate),
      "Asia/Ho_Chi_Minh"
    );
    const day = format(startOfDay(zonedDate), "yyyy-MM-dd");

    if (!totals.daily[day]) {
      totals.daily[day] = {
        0: 0, // Vừa tạo
        1: 0, // Đã nhận
        2: 0, // Đang trong quá trình giặt
        3: 0, // Đã hoàn thành
      };
    }

    totals.daily[day][order.status] += 1;
  });

  return totals;
};
// Thay đổi phần tính toán ngày gần nhất
const getLastSevenDays = () => {
  const today = startOfDay(new Date());
  const lastSevenDays = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, i);
    lastSevenDays.push(format(date, "yyyy-MM-dd"));
  }
  return lastSevenDays.reverse(); // Đảo ngược để ngày gần nhất ở đầu
};

// Thay đổi phần lọc dữ liệu
const filterDataForLastSevenDays = (data: any[], lastSevenDays: string[]) => {
  const dataMap = new Map<string, any>();

  // Map dữ liệu theo ngày
  data.forEach((entry) => {
    dataMap.set(entry.date, entry);
  });

  // Tạo dữ liệu cho tất cả các ngày trong lastSevenDays
  return lastSevenDays.map((date) => ({
    date,
    ...(dataMap.get(date) || {
      income: 0,
      expense: 0,
      unpaidInvoices: 0,
      orders: { 0: 0, 1: 0, 2: 0, 3: 0 },
    }),
  }));
};

const HomeForm = ({
  purchases,
  invoices,
  purchaseDetails,
  orders,
}: {
  purchases: PurchasesResType["data"] | null;
  invoices: InvoicesResType["data"] | null;
  purchaseDetails: PurchaseDetailResType["data"] | null;
  orders: OrdersResType["data"] | null;
}) => {
  const { user, setUser } = useAppContext();

  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRoleData = async () => {
      if (user?.username) {
        try {
          const roleData = await authApiRequest.roleIdClient(user.username);

          if (roleData && roleData.payload.data === 2) {
            setIsStaff(true);
            setIsAdmin(false);
          } else if (roleData && roleData.payload.data === 3) {
            setIsAdmin(true);
            setIsStaff(false);
          } else {
            setIsStaff(false);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    };

    fetchRoleData();
  }, [user?.username]);

  const lastSevenDays = useMemo(() => getLastSevenDays(), []);
  const filteredDatesInRange = useMemo(() => {
    if (isStaff && orders) {
      const orderTotals = calculateOrderTotals(orders);
      const dates = Object.keys(orderTotals.daily).map((date) => ({
        date,
        ...orderTotals.daily[date],
      }));
      return filterDataForLastSevenDays(dates, lastSevenDays);
    }
    return [];
  }, [isStaff, orders, lastSevenDays]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [startDate, setStartDate] = useState(
    new Date(`${year}-${month + 1}-01`)
  );
  const [endDate, setEndDate] = useState(
    new Date(
      new Date(startDate).getFullYear(),
      new Date(startDate).getMonth() + 1,
      0
    )
  );

  const totals = calculateTotals(invoices, purchaseDetails, purchases);
  const orderTotals = calculateOrderTotals(orders);

  const datesInRange = useMemo(() => {
    return getDatesInRange(startDate, endDate).map((date) => ({
      date,
      income: totals.daily[date]?.income || 0,
      expense: totals.daily[date]?.expense || 0,
      unpaidInvoices: totals.daily[date]?.unpaidInvoicesAmount || 0,
      orders: orderTotals.daily[date] || { 0: 0, 1: 0, 2: 0, 3: 0 },
    }));
  }, [startDate, endDate, totals, orderTotals]);

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-2))",
    },
    unpaidInvoices: {
      label: "Unpaid ",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("income");

  const total = useMemo(
    () => ({
      income: datesInRange.reduce((acc, curr) => acc + curr.income, 0),
      expense: datesInRange.reduce((acc, curr) => acc + curr.expense, 0),
      unpaidInvoices: datesInRange.reduce(
        (acc, curr) => acc + curr.unpaidInvoices,
        0
      ),
    }),
    [datesInRange]
  );

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setYear(newYear);
    setStartDate(new Date(`${newYear}-${month + 1}-01`));
    setEndDate(new Date(newYear, month + 1, 0));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    setMonth(newMonth);
    setStartDate(new Date(`${year}-${newMonth + 1}-01`));
    setEndDate(new Date(year, newMonth + 1, 0));
  };

  return (
    <Card>
      {!isStaff && (
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-1.5 sm:py-2">
            <CardTitle className="text-xs sm:text-sm">
              Biểu đồ thu và chi tháng {month + 1} năm {year}
            </CardTitle>
            <CardDescription className="text-xs sm:text-xs">
              Hiển thị tổng thu nhập, chi phí và hóa đơn chưa thanh toán cho kỳ
              chọn
            </CardDescription>
          </div>

          <div className="flex">
            {["income", "expense", "unpaidInvoices"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-4"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-2xl">
                    {formatCurrency(total[key as keyof typeof total])}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
      )}
      <CardContent className="px-2 sm:p-4">
        {!isStaff && (
          <div className="flex justify-between mb-2">
            <select
              value={year}
              onChange={handleYearChange}
              className="bg-white border border-gray-300 text-gray-700 rounded p-1 sm:p-2"
            >
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
            <select
              value={month}
              onChange={handleMonthChange}
              className="bg-white border border-gray-300 text-gray-700 rounded p-1 sm:p-2 ml-2"
            >
              {Array.from({ length: 12 }, (_, i) => i).map((monthOption) => (
                <option key={monthOption} value={monthOption}>
                  {new Date(year, monthOption).toLocaleString("vi-VN", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
        )}
        {!isStaff && (
          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                const newStartDate = new Date(startDate);
                newStartDate.setDate(newStartDate.getDate() - 7);
                setStartDate(newStartDate);
                setEndDate(
                  new Date(
                    newStartDate.getFullYear(),
                    newStartDate.getMonth(),
                    newStartDate.getDate() + 6
                  )
                );
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Previous Week
            </button>
            <button
              onClick={() => {
                const newStartDate = new Date(startDate);
                newStartDate.setDate(newStartDate.getDate() + 7);
                setStartDate(newStartDate);
                setEndDate(
                  new Date(
                    newStartDate.getFullYear(),
                    newStartDate.getMonth(),
                    newStartDate.getDate() + 6
                  )
                );
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Next Week
            </button>
          </div>
        )}
        {isAdmin && (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[200px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={datesInRange}
                margin={{
                  left: 10,
                  right: 10,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  minTickGap={16}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("vi-VN", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[120px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("vi-VN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                />
              </BarChart>
            </ChartContainer>

            <div className="mt-0 ">
              <h2 className="text-lg font-bold mb-3 text-center ">
                Thống kê số lượng đơn hàng
              </h2>
              <BarChart
                width={1000}
                height={250}
                data={datesInRange}
                margin={{
                  top: 5,
                  right: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
                <Bar
                  dataKey="orders[0]"
                  stackId="a"
                  fill="#8884d8"
                  name="Vừa tạo"
                />
                <Bar
                  dataKey="orders[1]"
                  stackId="a"
                  fill="#82ca9d"
                  name="Đã nhận"
                />
                <Bar
                  dataKey="orders[2]"
                  stackId="a"
                  fill="#ffc658"
                  name="Đang giặt"
                />
                <Bar
                  dataKey="orders[3]"
                  stackId="a"
                  fill="#ff8042"
                  name="Hoàn thành"
                />
              </BarChart>
            </div>
          </>
        )}
        {!isAdmin && isStaff && (
          <div className="mt-0">
            <h2 className="text-lg font-bold mb-3 text-center text-blue-800">
              Số lượng đơn hàng trong 7 ngày gần nhất
            </h2>
            <BarChart
              width={1000}
              height={250}
              data={filteredDatesInRange}
              margin={{
                top: 5,
                right: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
              <Bar dataKey="0" stackId="a" fill="#8884d8" name="Vừa tạo" />
              <Bar dataKey="1" stackId="a" fill="#82ca9d" name="Đã nhận" />
              <Bar dataKey="2" stackId="a" fill="#ffc658" name="Đang giặt" />
              <Bar dataKey="3" stackId="a" fill="#ff8042" name="Hoàn thành" />
            </BarChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeForm;
