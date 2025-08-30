import { useMediaQuery } from "@mantine/hooks";


export const useIsMobileScreen = () => useMediaQuery('(max-width: 1024px)');