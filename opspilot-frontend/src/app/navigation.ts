import {
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  SquareCheckBig,
  Handshake,
  Wallet,
  Package,
  Workflow,
  ChartNoAxesCombined,
  Bot,
  Files,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
export interface ModuleDefinition {
  path: string;
  title: string;
  group: string;
  icon: LucideIcon;
  description: string;
  capabilities: string[];
}
export const modules: ModuleDefinition[] = [
  {
    path: "dashboard",
    title: "Dashboard",
    group: "Workspace",
    icon: LayoutDashboard,
    description: "Your organization at a glance.",
    capabilities: [],
  },
  {
    path: "departments",
    title: "Departments",
    group: "Organization",
    icon: Building2,
    description: "Bring structure to your organization.",
    capabilities: [
      "Department directory",
      "Manager assignments",
      "Employee relationships",
    ],
  },
  {
    path: "employees",
    title: "Employees",
    group: "Organization",
    icon: Users,
    description: "A connected view of your people.",
    capabilities: [
      "Employee directory",
      "Profiles & employment status",
      "Department assignments",
    ],
  },
  {
    path: "projects",
    title: "Projects",
    group: "Operations",
    icon: FolderKanban,
    description: "Turn shared goals into measurable progress.",
    capabilities: [
      "Project portfolio",
      "Teams & milestones",
      "Progress & related tasks",
    ],
  },
  {
    path: "tasks",
    title: "Tasks",
    group: "Operations",
    icon: SquareCheckBig,
    description: "Keep the right work moving forward.",
    capabilities: [
      "Assignments & priorities",
      "Status management",
      "Due dates & project relationships",
    ],
  },
  {
    path: "crm",
    title: "CRM",
    group: "Operations",
    icon: Handshake,
    description: "Build stronger customer relationships.",
    capabilities: [
      "Customer directory",
      "Contact details",
      "Leads & opportunities",
    ],
  },
  {
    path: "finance",
    title: "Finance",
    group: "Operations",
    icon: Wallet,
    description: "Understand the financial health of your business.",
    capabilities: [
      "Revenue & expenses",
      "Transaction history",
      "Budgets & reporting",
    ],
  },
  {
    path: "inventory",
    title: "Inventory",
    group: "Operations",
    icon: Package,
    description: "Visibility across every item and asset.",
    capabilities: [
      "Stock & asset directory",
      "Inventory details",
      "Stock status",
    ],
  },
  {
    path: "automation",
    title: "Workflow Automation",
    group: "Intelligence & Automation",
    icon: Workflow,
    description: "Make repeatable work flow effortlessly.",
    capabilities: [
      "Workflow catalog",
      "Triggers & approvals",
      "Execution history",
    ],
  },
  {
    path: "analytics",
    title: "Analytics & Reports",
    group: "Intelligence & Automation",
    icon: ChartNoAxesCombined,
    description: "Move from information to informed decisions.",
    capabilities: [
      "Operational reports",
      "Power BI · integration pending",
      "Snowflake & Qlik Sense · integration pending",
    ],
  },
  {
    path: "ai-assistant",
    title: "AI Assistant",
    group: "Intelligence & Automation",
    icon: Bot,
    description: "A clearer perspective on your operations.",
    capabilities: [
      "Operational questions",
      "Intelligence summaries",
      "Contextual recommendations",
    ],
  },
  {
    path: "documents",
    title: "Documents",
    group: "Resources",
    icon: Files,
    description: "Keep organizational knowledge within reach.",
    capabilities: [
      "Document library",
      "File details",
      "Permission-aware uploads & downloads",
    ],
  },
  {
    path: "settings",
    title: "Settings",
    group: "Settings",
    icon: Settings,
    description: "Make OpsPilot work for you.",
    capabilities: [],
  },
];
export const groups = [
  "Workspace",
  "Organization",
  "Operations",
  "Intelligence & Automation",
  "Resources",
];
