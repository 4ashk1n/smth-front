import { FloatingIndicator, Tabs } from "@mantine/core";
import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { useSearchStore } from "../contexts/Search.context";
import type { SearchTab } from "../stores/Search.store";

const SearchTabs = observer(() => {
    const store = useSearchStore();
    const [controlsRefs, setControlsRefs] = useState<Record<SearchTab, HTMLButtonElement | null>>({
        articles: null,
        users: null,
        categories: null,
    });
    const controlRefSetters = useRef<Record<SearchTab, ((node: HTMLButtonElement | null) => void) | undefined>>({
        articles: undefined,
        users: undefined,
        categories: undefined,
    });

    const setControlRef = (tab: SearchTab) => {
        if (!controlRefSetters.current[tab]) {
            controlRefSetters.current[tab] = (node: HTMLButtonElement | null) => {
                setControlsRefs((prev) => (prev[tab] === node ? prev : { ...prev, [tab]: node }));
            };
        }
        return controlRefSetters.current[tab]!;
    };

    return (
        <Tabs
            w='100%'
            c='white'
            variant="none"
            value={store.currentTab}
            onChange={(nextValue) => nextValue && store.setCurrentTab(nextValue as SearchTab)}
        >
            <Tabs.List px={16} grow w='100%' pos={'relative'}>
                {
                    store.allowedTabs.map((tab) => {
                        return (
                            <Tabs.Tab
                                key={tab}
                                value={tab}
                                ref={setControlRef(tab as SearchTab)}
                                style={{
                                    opacity: store.currentTab === tab ? 1 : 0.5,
                                    transition: 'opacity 0.2s ease-in-out',
                                }}
                                styles={{
                                    tabLabel: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }
                                }}
                            >
                                {store.getSearchTabName(tab)}
                            </Tabs.Tab>
                        )
                    })
                }

                <FloatingIndicator
                    bg='transparent'
                    style={{
                        borderBottom: '2px solid white',
                    }}
                    target={controlsRefs[store.currentTab]}
                    parent={controlsRefs[store.currentTab]?.parentElement as HTMLDivElement | null}
                />
            </Tabs.List>
        </Tabs>
    )
})


export default SearchTabs
