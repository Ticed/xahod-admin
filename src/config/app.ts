interface IDashboardMenus {
  title: string
  icon: string
  path: string
  description?: string
  hidden?: boolean
}

export const SIDEBAR_EXPAND_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const APP_MENU: Record<string, { name: string, routes: IDashboardMenus[] }> = {
  main: {
    name: 'Core',
    routes: [
      {
        title: 'Dashboard',
        icon: 'LayoutDashboard',
        path: 'home',
        description: 'Overview and Recent Activity'
      },
      {
        title: 'Transactions',
        icon: 'RepeatCircle',
        path: 'transactions',
        description: 'Manage XRP/XAH Transactions'
      },
      {
        title: 'Trades',
        icon: 'TrendingUp',
        path: 'trades',
        description: 'View Exchange Trades'
      },
    ],
  },
  market: {
    name: 'Market',
    routes: [
      {
        title: 'Market Overview',
        icon: 'LineChart',
        path: 'market',
        description: 'Market Rates and Charts'
      },
      {
        title: 'Analytics',
        icon: 'BarChart',
        path: 'analytics',
        description: 'Performance and Profitability Reports'
      },
    ]
  },
  settings: {
    name: 'System',
    routes: [
      {
        path: 'settings',
        title: 'Settings',
        icon: 'Settings2',
        description: 'System Configuration'
      },
    ],
  },
};

export const globalSearch = {

};
