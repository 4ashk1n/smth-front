import {
    ActionIcon,
    Alert,
    Checkbox,
    Grid,
    Group,
    Popover,
    ScrollArea,
    Skeleton,
    Stack,
    Text,
    TextInput,
    type StackProps,
} from "@mantine/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FiFilter, FiSearch } from "react-icons/fi";
import { ImHome } from "react-icons/im";
import { iconComponents } from "./ReactIcon";

// --- настройки ---
const LIMIT = 60;
const LOAD_MORE_THRESHOLD_PX = 240;
const FILTER_MENU_MAX_H = 260;

type IconModule = Record<string, IconType>;

const IconSelectMenuItem: React.FC<{
  name: string;
  icon: IconType;
  onClick: () => void;
}> = ({ name, icon: Icon, onClick }) => {
  return (
    <Stack
      gap={5}
      p={10}
      style={{ borderRadius: "10px", cursor: "pointer" }}
      bg={"#00000080"}
      align="center"
      justify="center"
      h={"100%"}
      onClick={onClick}
    >
      <Icon color="white" size={20} />
      <Text style={{ textAlign: "center" }} lh={1} c="#ffffff80" size="12px">
        {name}
      </Text>
    </Stack>
  );
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const IconSelectMenu: React.FC<
  StackProps & {
    setIcon: (icon: string) => void;
    color?: string;
  }
> = (props) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const [filtersOpened, setFiltersOpened] = useState(false);
  const [selectedLibs, setSelectedLibs] = useState<string[]>([]);

  const [modules, setModules] = useState<Record<string, IconModule | null>>({});
  const [loadingLibs, setLoadingLibs] = useState<Record<string, boolean>>({});

  const [visibleCount, setVisibleCount] = useState(LIMIT);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const shouldShowResults = debouncedQuery.trim().length > 0 || selectedLibs.length > 0;

  const effectiveLibs = useMemo(() => {
    if (!shouldShowResults) return [];
    return selectedLibs.length > 0 ? selectedLibs : Object.keys(libs);
  }, [selectedLibs, shouldShowResults]);

  useEffect(() => {
    setVisibleCount(LIMIT);
    const el = viewportRef.current;
    if (el) el.scrollTop = 0;
  }, [debouncedQuery, selectedLibs.join("|")]);

  useEffect(() => {
    let cancelled = false;

    async function loadLib(libKey: string) {
      if (modules[libKey] !== undefined) return; 
      setModules((p) => ({ ...p, [libKey]: null }));
      setLoadingLibs((p) => ({ ...p, [libKey]: true }));

      try {
        const loader = iconComponents[libKey];
        const mod = loader ? ((await loader()) as IconModule) : ({} as IconModule);

        if (cancelled) return;
        setModules((p) => ({ ...p, [libKey]: mod }));
      } finally {
        if (cancelled) return;
        setLoadingLibs((p) => ({ ...p, [libKey]: false }));
      }
    }

    if (!shouldShowResults) return;

    effectiveLibs.forEach((k) => void loadLib(k));

    return () => {
      cancelled = true;
    };
  }, [effectiveLibs.join("|"), shouldShowResults]);

  const allFilteredItems = useMemo(() => {
    if (!shouldShowResults) return [];

    const q = debouncedQuery.trim().toLowerCase();

    const out: { name: string; icon: IconType }[] = [];

    for (const libKey of effectiveLibs) {
      const mod = modules[libKey];
      if (!mod) continue; // ещё не загрузилось

      for (const iconName of Object.keys(mod)) {
        if (q && !iconName.toLowerCase().includes(q)) continue;
        const Icon = mod[iconName];
        if (!Icon) continue;
        out.push({ name: iconName, icon: Icon });
      }
    }

    return out;
  }, [debouncedQuery, effectiveLibs, modules, shouldShowResults]);

  const visibleItems = useMemo(() => {
    return allFilteredItems.slice(0, visibleCount);
  }, [allFilteredItems, visibleCount]);

  const canLoadMore = visibleCount < allFilteredItems.length;

  const onScrollPositionChange = () => {
    const el = viewportRef.current;
    if (!el) return;
    if (!shouldShowResults) return;
    if (!canLoadMore) return;

    const distanceToBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    if (distanceToBottom < LOAD_MORE_THRESHOLD_PX) {
      setVisibleCount((c) => Math.min(c + LIMIT, allFilteredItems.length));
    }
  };

  const anyLibLoading = useMemo(() => {
    return effectiveLibs.some((k) => loadingLibs[k]);
  }, [effectiveLibs, loadingLibs]);

  const toggleLib = (libKey: string) => {
    setSelectedLibs((prev) =>
      prev.includes(libKey) ? prev.filter((x) => x !== libKey) : [...prev, libKey]
    );
  };

  return (
    <Stack gap={10} align="center" style={{ height: "100%", ...props.style }} {...props}>
      <Alert
        mih={"fit-content"}
        fz={16}
        variant="light"
        // title={"Поиск на английском"}
        color="#ffffff"
        w="100%"
        p={10}
        style={{ borderRadius: "10px" }}
        // icon={<IoAlertSharp size={20} />}
      >
        <Text fz={12} lh={1.2} c="#ffffff80">
          Поиск работает по названиям иконок. Примеры: "house", "telegram", "cat"
        </Text>
      </Alert>

      <Group w="100%" gap={8} align="center" wrap="nowrap">
        <TextInput
          size="sm"
          w="100%"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          leftSection={<FiSearch />}
          placeholder="Поиск иконок (англ)"
          radius={"10"}
          styles={{
            input: {
              backgroundColor: "#00000080",
              color: "white",
              border: "none",
            },
          }}
        />

        <Popover opened={filtersOpened} onChange={setFiltersOpened} position="top-end" withArrow zIndex={2000}>
          <Popover.Target>
            <ActionIcon
              size="36"
              radius={10}
              variant="subtle"
              onClick={() => setFiltersOpened((v) => !v)}
              style={{ background: "#00000080" }}
              aria-label="Фильтры библиотек"
            >
              <FiFilter color="white" />
            </ActionIcon>
          </Popover.Target>

          <Popover.Dropdown
            style={{
              background: "#0b0b0bcc",
              border: "1px solid #ffffff14",
              borderRadius: 12,
              width: 260,
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack gap={10}>
              <Group justify="space-between" align="center">
                <Text c="white" fw={600} fz={14}>
                  Библиотеки
                </Text>

                {/* <ActionIcon
                  variant="subtle"
                  onClick={clearFilters}
                  disabled={selectedLibs.length === 0}
                  style={{ borderRadius: 10 }}
                  aria-label="Сбросить фильтры"
                >
                  <FiX color={selectedLibs.length ? "white" : "#ffffff55"} />
                </ActionIcon> */}
              </Group>

              <ScrollArea h={FILTER_MENU_MAX_H} scrollbars="y">
                <Stack gap={8}>
                  {Object.keys(libs).map((libKey) => {
                    const lib = libs[libKey];
                    const checked = selectedLibs.includes(libKey);
                    const DemoIcon = lib.icon;

                    return (
                      <Checkbox
                        key={libKey}
                        checked={checked}
                        color={props.color || "black"}
                        onChange={() => toggleLib(libKey)}
                        label={
                          <Group gap={8} wrap="nowrap">
                            <DemoIcon size={16} color="white" />
                            <Text c="white" fz={13}>
                              {lib.name}
                            </Text>
                          </Group>
                        }
                        styles={{
                          input: { cursor: "pointer" },
                          label: { cursor: "pointer" },
                        }}
                      />
                    );
                  })}
                </Stack>
              </ScrollArea>

              <Text c="#ffffff80" fz={12} lh={1.2}>
                Если фильтры не выбраны, поиск идёт по всем библиотекам.
              </Text>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>

      <ScrollArea
        h="100%"
        w="100%"
        viewportRef={viewportRef}
        onScrollPositionChange={onScrollPositionChange}
        scrollbars="y"
      >
        {!shouldShowResults ? (
          <Stack align="center" justify="center" mih={220} gap={8}>
            <Text c="#ffffff80" fz={14} ta="center">
              Выберите библиотеки в фильтрах или начните вводить поиск
            </Text>
          </Stack>
        ) : (
          <>
            {anyLibLoading && visibleItems.length === 0 && (
              <Grid gutter={10}>
                {Array(10)
                  .fill(0)
                  .map((_, idx) => (
                    <Grid.Col key={`sk-${idx}`} span={6}>
                      <Skeleton visible h="100%" w="100%" radius={10} opacity={0.2}>
                        <IconSelectMenuItem icon={ImHome} name="loading" onClick={() => {}} />
                      </Skeleton>
                    </Grid.Col>
                  ))}
              </Grid>
            )}

            {visibleItems.length > 0 ? (
              <Grid gutter={10}>
                {visibleItems.map((item) => (
                  <Grid.Col key={item.name} span={6}>
                    <IconSelectMenuItem
                      name={item.name}
                      icon={item.icon}
                      onClick={() => props.setIcon(item.name)}
                    />
                  </Grid.Col>
                ))}

                {canLoadMore && (
                  <>
                    {Array(6)
                      .fill(0)
                      .map((_, idx) => (
                        <Grid.Col key={`more-${idx}`} span={6}>
                          <Skeleton visible h="100%" w="100%" radius={10} opacity={0.12}>
                            <IconSelectMenuItem icon={ImHome} name="..." onClick={() => {}} />
                          </Skeleton>
                        </Grid.Col>
                      ))}
                  </>
                )}
              </Grid>
            ) : (
              !anyLibLoading && (
                <Stack align="center" justify="center" mih={220} gap={8}>
                  <Text c="#ffffff80" fz={14} ta="center">
                    Ничего не найдено
                  </Text>
                </Stack>
              )
            )}
          </>
        )}
      </ScrollArea>
    </Stack>
  );
};

export default IconSelectMenu;

import { AiOutlineHome } from "react-icons/ai";
import { BiHome } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { CgHome } from "react-icons/cg";
import { CiHome } from "react-icons/ci";
import { DiTerminal } from "react-icons/di";
import { FaHouse } from "react-icons/fa6";
import { FcHome } from "react-icons/fc";
import { FiHome } from "react-icons/fi";
import { GiHouse } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { GrHome } from "react-icons/gr";
import { HiHome } from "react-icons/hi2";
import { IoHome } from "react-icons/io5";
import { LiaHomeSolid } from "react-icons/lia";
import { LuHouse } from "react-icons/lu";
import { MdHome } from "react-icons/md";
import { PiHouse } from "react-icons/pi";
import { RiHome2Line } from "react-icons/ri";
import { RxHome } from "react-icons/rx";
import { SiTelegram } from "react-icons/si";
import { SlHome } from "react-icons/sl";
import { TbHome } from "react-icons/tb";
import { TfiHome } from "react-icons/tfi";
import { TiHome } from "react-icons/ti";
import { VscHome } from "react-icons/vsc";
import { WiDayRainMix } from "react-icons/wi";

const libs: { [key: string]: { name: string; icon: IconType } } = {
  Ai: { name: "Ant Design", icon: AiOutlineHome },
  Bs: { name: "Bootstrap", icon: BsHouse },
  Bi: { name: "BoxIcons", icon: BiHome },
  Ci: { name: "Circum", icon: CiHome },
  Di: { name: "Devicons", icon: DiTerminal },
  Fi: { name: "Feather", icon: FiHome },
  Fc: { name: "Flat Color", icon: FcHome },
  Fa: { name: "Font Awesome 6", icon: FaHouse },
  Gi: { name: "Game Icons", icon: GiHouse },
  Go: { name: "GitHub Octicons", icon: GoHome },
  Gr: { name: "Grommet", icon: GrHome },
  Hi: { name: "Heroicons 2", icon: HiHome },
  Im: { name: "IcoMoon", icon: ImHome },
  Lia: { name: "Line Awesome", icon: LiaHomeSolid },
  Io: { name: "Ionicons 5", icon: IoHome },
  Lu: { name: "Lucide", icon: LuHouse },
  Md: { name: "Material Design", icon: MdHome },
  Pi: { name: "Phosphor", icon: PiHouse },
  Rx: { name: "Radix", icon: RxHome },
  Ri: { name: "Remix", icon: RiHome2Line },
  Si: { name: "Simple", icon: SiTelegram },
  Sl: { name: "Simple Line", icon: SlHome },
  Tb: { name: "Tabler", icon: TbHome },
  Tfi: { name: "Themify", icon: TfiHome },
  Ti: { name: "Typicons", icon: TiHome },
  Vsc: { name: "VS Code", icon: VscHome },
  Wi: { name: "Weather", icon: WiDayRainMix },
  Cg: { name: "css.gg", icon: CgHome },
};
