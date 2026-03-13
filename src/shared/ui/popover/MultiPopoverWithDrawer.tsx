import { Badge, Button, Drawer, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { AiSuggestion } from "@smth/shared";
import { useMemo } from "react";

type MultiPopoverWithDrawerProps = {
  suggestions: AiSuggestion[];
  hidden?: boolean;
};

const MultiPopoverWithDrawer = ({ suggestions, hidden = false }: MultiPopoverWithDrawerProps) => {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const level = useMemo<"warning" | "error">(
    () =>
      suggestions.some((suggestion) => (suggestion.severity ?? "").toLowerCase() === "error")
        ? "error"
        : "warning",
    [suggestions],
  );

  if (hidden || suggestions.length === 0) return null;

  return (
    <>
      <Button
        size="compact-xs"
        variant="filled"
        color={level === "error" ? "red" : "yellow"}
        onClick={openDrawer}
      >
        <Group gap={6} wrap="nowrap">
          <Text size="xs" fw={600}>
            Замечания
          </Text>
          <Badge size="sm" variant="filled" color={level === "error" ? "dark" : "gray"}>
            {suggestions.length}
          </Badge>
        </Group>
      </Button>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        withCloseButton={false}
        size="sm"
        position="bottom"
        zIndex={1000}
        styles={{
          content: {
            backgroundColor: "#000000c0",
            backdropFilter: "blur(10px)",
            maxHeight: "70vh",
          },
          body: {
            overflowY: "auto",
            padding: 12,
          },
          overlay: {
            backgroundColor: "#00000040",
          },
        }}
      >
        <Stack gap={10}>
          {suggestions.map((suggestion) => (
            <Stack
              key={suggestion.suggestionId}
              gap={4}
              p={10}
              style={{
                borderRadius: 8,
                border: `1px solid ${level === "error" ? "#ff6b6b" : "#ffd43b"}`,
                background: "#00000066",
              }}
            >
              <Text
                size="sm"
                style={{ whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {suggestion.message}
              </Text>
              {suggestion.proposedFix && (
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word" }}
                >
                  {suggestion.proposedFix}
                </Text>
              )}
            </Stack>
          ))}
        </Stack>
      </Drawer>
    </>
  );
};

export default MultiPopoverWithDrawer;
