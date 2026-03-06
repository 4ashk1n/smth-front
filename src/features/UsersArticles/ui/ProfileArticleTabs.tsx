import { FloatingIndicator, Tabs } from "@mantine/core";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { PiBooks, PiDownloadSimple, PiEyes, PiHeart, PiShareFat } from "react-icons/pi";
import { useAuthStore } from "../../../entities/user/contexts/auth.context";
import type { ProfileTabs } from "../../../widgets/ProfileArticles/types/tabs.types";

const Icons: Record<ProfileTabs, React.ReactNode> = {
    articles: <PiBooks size={24} />,
    reviews: <PiEyes size={24} />,
    likes: <PiHeart size={24} />,
    saved: <PiDownloadSimple size={24} />,
    reposts: <PiShareFat size={24} />,
}

const ProfileArticleTabs: React.FC<{
    userId: string
    selectedTab: ProfileTabs
    setSelectedTab: (tab: ProfileTabs) => void
}> = observer(({ userId, selectedTab, setSelectedTab }) => {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [value, setValue] = useState<ProfileTabs>(selectedTab);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: ProfileTabs) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };
    const auth = useAuthStore()

    useEffect(() => {
        setSelectedTab(value)
    }, [value])
    

    return (
        <Tabs w='100%' c='white' variant="none" value={value} onChange={setValue as any}>
            <Tabs.List px={16} grow w='100%' ref={setRootRef} pos={'relative'}>
                {
                    Object.keys(Icons).map((tab) => {
                        console.log(auth)
                        if (!auth.user || !auth.isAuthenticated || auth.user.id !== userId) {
                            if (tab === 'reviews' || tab === 'likes' || tab === 'saved') {
                                return null
                            }
                        }
                        return (<Tabs.Tab
                            key={tab}
                            value={tab}
                            ref={setControlRef(tab as ProfileTabs)}
                            onClick={() => setValue(tab as ProfileTabs)}
                            style={{
                                opacity: value === tab ? 1 : 0.5,
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
                            {Icons[tab as ProfileTabs]}
                        </Tabs.Tab>
                    )})
                }

                <FloatingIndicator
                    bg='transparent'
                    style={{ 
                        borderBottom: '2px solid white',
                    }}
                    target={value ? controlsRefs[value] : null}
                    parent={rootRef}
                />
            </Tabs.List>
        </Tabs>
    )

})


export default ProfileArticleTabs