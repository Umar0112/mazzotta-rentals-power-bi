import { useState, type ReactNode, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  List,
  ScrollText,
  Eye,
  Settings,
  ChevronDown,
  CalendarRange,
  FileText,
  MapPin,
  Building2,
  BarChart3,
} from "lucide-react";
import mazzottaLogo from "./mazzotta-logo.png";
import { ApiService } from "../services/api/apiService";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export function Sidebar({ collapsed, onToggle, width, onWidthChange }: SidebarProps) {
  const [allLocOpen, setAllLocOpen] = useState(true);
  const [openLocs, setOpenLocs] = useState<Record<string, boolean>>({});
  const [isResizing, setIsResizing] = useState(false);
  const navigate = useNavigate();
  const { location: routeLocation, reportType: routeReportType } = useParams();
  const { pathname } = useLocation();

  const activeItem = useMemo(() => {
    if (pathname.startsWith("/equipment-qty-report")) {
      const parts = pathname.split("/");
      if (parts.length > 2) return `location-${parts[2]}-equipment-qty`;
      return "equipment-qty-report";
    }
    if (pathname.startsWith("/combined-equipment-qty-report")) {
      const parts = pathname.split("/");
      if (parts.length > 2) return `location-${parts[2]}-combined-equipment`;
      return "combined-equipment-qty-report";
    }
    if (routeLocation && routeReportType) return `location-${routeLocation}-${routeReportType}`;
    if (routeLocation) return `eyeball-${routeLocation}`;
    if (pathname === "/dashboard") return "all-reservations";
    if (pathname === "/all-contracts") return "all-contracts";
    if (pathname === "/all-reservations-contracts") return "all-reservations-contracts";
    if (pathname === "/res-contracts-1-day") return "res-contracts-1-day";
    if (pathname === "/res-contracts-2-days") return "res-contracts-2-days";
    if (pathname === "/res-contracts-3-days") return "res-contracts-3-days";
    if (pathname === "/res-contracts-4-days") return "res-contracts-4-days";
    if (pathname === "/res-contracts-5-days") return "res-contracts-5-days";
    return "";
  }, [routeLocation, routeReportType, pathname]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 160), 400);
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const toggleLoc = (id: string) =>
    setOpenLocs((p) => ({ ...p, [id]: !p[id] }));

  const locations = ["0001", "0002", "0003", "0004", "0005"];
  const eyeballLocations = ["all", "0001", "0002", "0003", "0004", "0005"];

  const handleEyeballClick = (loc: string) => {
    navigate(`/eyeball/${loc}`);
  };

  const currentWidth = collapsed ? 60 : width;

  return (
    <aside
      className="bg-white flex flex-col h-full shrink-0 relative overflow-hidden group/sidebar"
      style={{
        width: `${currentWidth}px`,
        minWidth: `${currentWidth}px`,
        transition: isResizing ? "none" : "width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)",
        borderRight: "1px solid rgba(216,224,236,0.5)",
        willChange: "width",
      }}
    >
      {/* Resize handle */}
      {!collapsed && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#C72E23]/20 active:bg-[#C72E23]/40 z-50 transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      {/* Logo / Toggle */}
      <div
        className="flex items-center h-[60px] shrink-0 relative"
        style={{ borderBottom: "1px solid rgba(216,224,236,0.3)" }}
      >
        <div
          className="flex items-center pl-4 absolute inset-0"
          style={{
            opacity: collapsed ? 0 : 1,
            pointerEvents: collapsed ? "none" : "auto",
            transition: "opacity 0.18s ease",
          }}
        >
          <img
            src={mazzottaLogo}
            alt="Mazzotta Equipment Rentals"
            className="h-8 w-auto"
          />
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-1 flex flex-col gap-0.5"
        style={{ overflowY: collapsed ? "hidden" : "auto", overflowX: "hidden" }}
      >
        {/* REPORTS heading */}
        <div
          className="px-1 pt-2 pb-1.5 overflow-hidden"
          style={{
            maxHeight: collapsed ? 0 : 40,
            opacity: collapsed ? 0 : 1,
            transition: "max-height 0.22s ease, opacity 0.18s ease",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              lineHeight: "14px",
              letterSpacing: "0.09em",
              color: "#94A3B8",
            }}
            className="uppercase select-none whitespace-nowrap"
          >
            Reports
          </span>
        </div>

        {/* Divider shown only when collapsed */}
        <div
          style={{
            maxHeight: collapsed ? 24 : 0,
            opacity: collapsed ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.22s ease, opacity 0.18s ease",
          }}
        >
          <div className="py-1">
            <div className="h-px bg-[#F1F5F9]" />
          </div>
        </div>

        {/* All Locations group */}
        <Collapsible.Root
          open={allLocOpen && !collapsed}
          onOpenChange={setAllLocOpen}
        >
          <Collapsible.Trigger asChild>
            <button
              className={cn(
                "w-full flex items-center px-3 py-[7px] rounded-[10px] text-[#475569] hover:bg-[#F8FAFC] transition-colors",
                collapsed ? "justify-center px-0 gap-0" : "gap-3"
              )}
            >
              <MapPin
                className={cn(
                  "w-[18px] h-[18px] shrink-0 text-[#94A3B8]",
                  collapsed && "mx-auto"
                )}
              />
              <span
                className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: "19.5px",
                  opacity: collapsed ? 0 : 1,
                  maxWidth: collapsed ? 0 : 200,
                  transition: "opacity 0.18s ease, max-width 0.22s ease",
                }}
              >
                Reservations & Contracts
              </span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-[#94A3B8] transition-transform duration-200 shrink-0",
                  allLocOpen ? "rotate-0" : "-rotate-90"
                )}
                style={{
                  opacity: collapsed ? 0 : 1,
                  maxWidth: collapsed ? 0 : 12,
                  overflow: "hidden",
                  transition: "opacity 0.15s ease, max-width 0.22s ease",
                }}
              />
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="ml-2 mt-0.5 flex flex-col gap-0.5 pl-3 border-l-2 border-[#F1F5F9]">
              <SubNavItem
                label="All Reservations"
                icon={<List className="w-3.5 h-3.5" />}
                active={activeItem === "all-reservations"}
                onClick={() => navigate("/dashboard")}
              />
              <SubNavItem
                label="All Contracts"
                icon={<ScrollText className="w-3.5 h-3.5" />}
                active={activeItem === "all-contracts"}
                onClick={() => navigate("/all-contracts")}
              />
              <SubNavItem
                label="All Reservations & Contracts"
                icon={<FileText className="w-3.5 h-3.5" />}
                active={activeItem === "all-reservations-contracts"}
                onClick={() => navigate("/all-reservations-contracts")}
              />
              <SubNavItem
                label="Reservations & Contracts 1 Days"
                icon={<CalendarRange className="w-3.5 h-3.5" />}
                active={activeItem === "res-contracts-1-day"}
                onClick={() => navigate("/res-contracts-1-day")}
              />
              <SubNavItem
                label="Reservations & Contracts 2 Days"
                icon={<CalendarRange className="w-3.5 h-3.5" />}
                active={activeItem === "res-contracts-2-days"}
                onClick={() => navigate("/res-contracts-2-days")}
              />
              <SubNavItem
                label="Reservations & Contracts 3 Days"
                icon={<CalendarRange className="w-3.5 h-3.5" />}
                active={activeItem === "res-contracts-3-days"}
                onClick={() => navigate("/res-contracts-3-days")}
              />
              <SubNavItem
                label="Reservations & Contracts 4 Days"
                icon={<CalendarRange className="w-3.5 h-3.5" />}
                active={activeItem === "res-contracts-4-days"}
                onClick={() => navigate("/res-contracts-4-days")}
              />
              <SubNavItem
                label="Reservations & Contracts 5 Days"
                icon={<CalendarRange className="w-3.5 h-3.5" />}
                active={activeItem === "res-contracts-5-days"}
                onClick={() => navigate("/res-contracts-5-days")}
              />
              <SubNavItem
                label="Equipment Qty Next 6 Days"
                icon={<BarChart3 className="w-3.5 h-3.5" />}
                active={activeItem === "equipment-qty-report"}
                onClick={() => navigate("/equipment-qty-report")}
                collapsed={collapsed}
              />
              <SubNavItem
                label="Combined Equipment Qty"
                icon={<BarChart3 className="w-3.5 h-3.5" />}
                active={activeItem === "combined-equipment-qty-report"}
                onClick={() => navigate("/combined-equipment-qty-report")}
                collapsed={collapsed}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* <SubNavItem
          label="Combined Reservations"
          icon={<FileText className="w-3.5 h-3.5" />}
          active={activeItem === "combined"}
          onClick={() => setActiveItem("combined")}
          padded
          collapsed={collapsed}
        />
        <SubNavItem
          label="6-Day Summary"
          icon={<CalendarRange className="w-3.5 h-3.5" />}
        {/* LOCATIONS heading */}
        <div
          className="px-1 overflow-hidden"
          style={{
            maxHeight: collapsed ? 0 : 48,
            opacity: collapsed ? 0 : 1,
            paddingTop: collapsed ? 0 : 16,
            paddingBottom: collapsed ? 0 : 6,
            transition: "max-height 0.22s ease, opacity 0.18s ease, padding 0.22s ease",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              lineHeight: "14px",
              letterSpacing: "0.09em",
              color: "#94A3B8",
            }}
            className="uppercase select-none whitespace-nowrap"
          >
            Locations
          </span>
        </div>

        {/* Divider shown only when collapsed */}
        <div
          style={{
            maxHeight: collapsed ? 24 : 0,
            opacity: collapsed ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.22s ease, opacity 0.18s ease",
          }}
        >
          <div className="py-1">
            <div className="h-px bg-[#F1F5F9]" />
          </div>
        </div>

        {/* Location items */}
        {locations.map((loc) =>
          collapsed ? (
            <button
              key={loc}
              onClick={() => toggleLoc(loc)}
              className={cn(
                "flex items-center justify-center py-2 rounded-[10px] transition-colors w-full",
                openLocs[loc]
                  ? "bg-[#FEF2F2] text-[#C72E23]"
                  : "text-[#94A3B8] hover:bg-[#F8FAFC]"
              )}
            >
              <Building2 className="w-[18px] h-[18px]" />
            </button>
          ) : (
            <Collapsible.Root
              key={loc}
              open={!!openLocs[loc]}
              onOpenChange={() => toggleLoc(loc)}
            >
              <Collapsible.Trigger asChild>
                <button className="w-full flex items-center gap-3 px-3 py-[7px] rounded-[10px] text-[#475569] hover:bg-[#F8FAFC] transition-colors group">
                  <Building2
                    className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-colors",
                      openLocs[loc] ? "text-[#C72E23]" : "text-[#94A3B8]"
                    )}
                  />
                  <span
                    className="flex-1 text-left whitespace-nowrap"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      lineHeight: "19.5px",
                    }}
                  >
                    Location {loc}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-[#94A3B8] transition-transform duration-200",
                      openLocs[loc] ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
              </Collapsible.Trigger>
              <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <div className="ml-2 mt-0.5 flex flex-col gap-0.5 pl-3 border-l-2 border-[#F1F5F9] pb-1">
                  <SubNavItem
                    label="Today Res. & Contracts"
                    icon={<List className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-today`}
                    onClick={() => navigate(`/location-report/${loc}/today`)}
                  />
                  <SubNavItem
                    label="Next Day Res. & Contracts"
                    icon={<CalendarRange className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-next-work-day`}
                    onClick={() => navigate(`/location-report/${loc}/next-work-day`)}
                  />
                  <SubNavItem
                    label="Day 2 Res. & Contracts"
                    icon={<CalendarRange className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-day-2`}
                    onClick={() => navigate(`/location-report/${loc}/day-2`)}
                  />
                  <SubNavItem
                    label="Day 3 Res. & Contracts"
                    icon={<CalendarRange className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-day-3`}
                    onClick={() => navigate(`/location-report/${loc}/day-3`)}
                  />
                  <SubNavItem
                    label="Day 4 Res. & Contracts"
                    icon={<CalendarRange className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-day-4`}
                    onClick={() => navigate(`/location-report/${loc}/day-4`)}
                  />
                  <SubNavItem
                    label="Day 5 Res. & Contracts"
                    icon={<CalendarRange className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-day-5`}
                    onClick={() => navigate(`/location-report/${loc}/day-5`)}
                  />
                  <SubNavItem
                    label="Combined Equipment Qty"
                    icon={<BarChart3 className="w-3.5 h-3.5" />}
                    active={activeItem === `location-${loc}-combined-equipment`}
                    onClick={() => navigate(`/combined-equipment-qty-report/${loc}`)}
                  />
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          )
        )}

        {/* EYEBALL LOCATION heading */}
        <div
          className="px-1 overflow-hidden"
          style={{
            maxHeight: collapsed ? 0 : 48,
            opacity: collapsed ? 0 : 1,
            paddingTop: collapsed ? 0 : 16,
            paddingBottom: collapsed ? 0 : 6,
            transition: "max-height 0.22s ease, opacity 0.18s ease, padding 0.22s ease",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              lineHeight: "14px",
              letterSpacing: "0.09em",
              color: "#94A3B8",
            }}
            className="uppercase select-none whitespace-nowrap"
          >
            Eyeball Location
          </span>
        </div>

        {/* Eyeball items */}
        {eyeballLocations.map((loc) => (
          <SubNavItem
            key={loc}
            label={loc === "all" ? "Eyeball location for All" : `Eyeball location ${loc}`}
            icon={<Eye className="w-3.5 h-3.5" />}
            active={activeItem === `eyeball-${loc}`}
            onClick={() => handleEyeballClick(loc)}
            padded
            collapsed={collapsed}
          />
        ))}

      </nav>

      {/* Bottom (Settings + User) */}
      <div
        className="px-3 pb-3 shrink-0"
        style={{ borderTop: "1px solid rgba(216,224,236,0.15)" }}
      >
        <div className="pt-2">
          <NavItem
            icon={<Settings className="w-[18px] h-[18px]" />}
            label="Settings"
            collapsed={collapsed}
            active={activeItem === "settings"}
            onClick={() => setActiveItem("settings")}
          />
        </div>

        {/* Expanded user profile */}
        <div
          className="overflow-hidden"
          style={{
            maxHeight: collapsed ? 0 : 60,
            opacity: collapsed ? 0 : 1,
            transition: "max-height 0.25s ease, opacity 0.18s ease",
          }}
        >
          <div
            className="mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
            style={{ background: "rgba(226,232,240,0.5)" }}
          >
            <div className="w-8 h-8 rounded-full bg-[#C72E23] flex items-center justify-center shrink-0">
              <span style={{ fontSize: "11px", fontWeight: 700, color: "white" }}>
                MR
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="truncate whitespace-nowrap"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  lineHeight: "19.5px",
                  color: "#475569",
                }}
              >
                Manager
              </span>
              <span
                className="truncate whitespace-nowrap"
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: "16.5px",
                  color: "rgba(71,85,105,0.5)",
                }}
              >
                mazzotta.com
              </span>
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #C72E23 0%, #EF4444 100%)" }}
            >
              <span style={{ fontSize: "8px", fontWeight: 700, color: "white" }}>
                GM
              </span>
            </div>
          </div>
        </div>

        {/* Collapsed avatar */}
        <div
          className="overflow-hidden"
          style={{
            maxHeight: collapsed ? 48 : 0,
            opacity: collapsed ? 1 : 0,
            transition: "max-height 0.25s ease, opacity 0.18s ease",
          }}
        >
          <div className="mt-1 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#C72E23] flex items-center justify-center">
              <span style={{ fontSize: "11px", fontWeight: 700, color: "white" }}>
                MR
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* Nav Item (Settings only) */
function NavItem({
  icon,
  label,
  collapsed,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "w-full flex items-center px-3 py-[8px] rounded-[10px] transition-colors",
        collapsed ? "justify-center px-0 gap-0" : "gap-3",
        active
          ? "bg-[#C72E23] text-white shadow-[0px_4px_6px_0px_rgba(199,46,35,0.25),0px_2px_4px_0px_rgba(199,46,35,0.2)]"
          : "text-[#475569] hover:bg-[#F8FAFC]"
      )}
    >
      <span className={cn("shrink-0", active ? "text-white" : "text-[#475569]")}>
        {icon}
      </span>
      <span
        className="whitespace-nowrap overflow-hidden"
        style={{
          fontSize: "13px",
          fontWeight: active ? 600 : 500,
          lineHeight: "19.5px",
          flex: 1,
          textAlign: "left",
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : 200,
          transition: "opacity 0.18s ease, max-width 0.22s ease",
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* Sub Nav Item */
function SubNavItem({
  label,
  icon,
  active,
  onClick,
  padded,
  collapsed,
}: {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  padded?: boolean;
  collapsed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "w-full flex items-center py-[7px] rounded-[8px] transition-colors text-left",
        padded ? "px-3" : "px-2",
        collapsed ? "justify-center px-0 gap-0" : "gap-2.5",
        active
          ? "bg-[#C72E23] text-white shadow-[0px_4px_6px_0px_rgba(199,46,35,0.25),0px_2px_4px_0px_rgba(199,46,35,0.2)]"
          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#334155]"
      )}
    >
      {icon && (
        <span className={cn("shrink-0", active ? "text-white/80" : "text-[#94A3B8]")}>
          {icon}
        </span>
      )}
      <span
        className="whitespace-nowrap overflow-hidden"
        style={{
          fontSize: "12px",
          fontWeight: active ? 600 : 400,
          lineHeight: "18px",
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : 200,
          transition: "opacity 0.18s ease, max-width 0.22s ease",
        }}
      >
        {label}
      </span>
    </button>
  );
}
