import { useEffect } from "react";

const PORTAL_SELECTOR = '[data-mantine-shared-portal-node="true"]';

export function useEditorJSPopoverToMantinePortal(holderId: string) {
  useEffect(() => {
    const holder = document.getElementById(holderId);
    if (!holder) return;

    let lastPopover: HTMLElement | null = null;

    const getPortal = () =>
      document.querySelector<HTMLElement>(PORTAL_SELECTOR);

    const moveToPortalIfPossible = () => {
      const popover =
        (holder.querySelector(".ce-popover.ce-popover--opened") as HTMLElement | null) ??
        lastPopover;

      if (!popover) return;

      // запоминаем последний найденный popover
      lastPopover = popover;

      const portal = getPortal();
      if (!portal) return; // портала ещё нет

      if (popover.parentElement !== portal) {
        portal.appendChild(popover);
        popover.classList.add("ej-bottom-sheet");
      }
    };

    // 1) следим за DOM внутри editor holder (popover появляется тут)
    const holderObs = new MutationObserver(moveToPortalIfPossible);
    holderObs.observe(holder, { childList: true, subtree: true });

    // 2) следим за body: когда Mantine создаст portal root — перенесём popover
    const bodyObs = new MutationObserver(moveToPortalIfPossible);
    bodyObs.observe(document.body, { childList: true, subtree: true });

    // стартовая попытка
    moveToPortalIfPossible();

    return () => {
      holderObs.disconnect();
      bodyObs.disconnect();
    };
  }, [holderId]);
}
