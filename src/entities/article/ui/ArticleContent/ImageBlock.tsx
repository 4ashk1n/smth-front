import { Anchor, Image as MantineImage, Stack, Text } from "@mantine/core";
import HighlitedBlock from "../../../../shared/ui/blocks/HighlitedBlock";
import { useArticleStore } from "../../contexts/article.context";
import type { Image } from "../../types/content.types";
import Object3dBlock from "./Object3dBlock";

const S3_PUBLIC_BASE_URL = (import.meta.env.VITE_S3_PUBLIC_BASE_URL as string | undefined) ?? "";

function normalizeKey(raw: string): string {
    return raw
        .split("/")
        .map((part) => {
            try {
                return decodeURIComponent(part);
            } catch {
                return part;
            }
        })
        .join("/")
        .replace(/^\/+/, "");
}

function extractObjectKey(value: string): string {
    const trimmed = (value ?? "").trim();
    if (!trimmed) return "";

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return normalizeKey(trimmed);
    }

    try {
        const parsed = new URL(trimmed);
        const path = parsed.pathname.replace(/^\/+/, "");
        if (!path) return "";

        // path-style URL: s3.cloud.ru/<bucket>/<key>
        const pathSegments = path.split("/");
        if (parsed.hostname === "s3.cloud.ru" && pathSegments.length > 1) {
            return normalizeKey(pathSegments.slice(1).join("/"));
        }

        // virtual-hosted URL: <bucket>.s3.cloud.ru/<key>
        return normalizeKey(path);
    } catch {
        return normalizeKey(trimmed);
    }
}

function resolveImageSrc(block: Image): string {
    const key = extractObjectKey(block.url ?? "");
    if (!key) return "";

    if (!S3_PUBLIC_BASE_URL) {
        return key;
    }

    const base = S3_PUBLIC_BASE_URL.endsWith("/") ? S3_PUBLIC_BASE_URL.slice(0, -1) : S3_PUBLIC_BASE_URL;
    const encodedKey = key
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");

    return `${base}/${encodedKey}`;
}

const ImageBlock: React.FC<{ block: Image }> = (props) => {
    const { mainCategory } = useArticleStore();
    const imageSrc = resolveImageSrc(props.block);

    const Image2d = () =>
        <HighlitedBlock
            p={0}
            w='100%'
            h='100%'
            glow
            {...mainCategory.colors}
        >
            <MantineImage src={imageSrc} w='100%' h='100%' fit='cover' />

            <Stack
                pos={'absolute'}
                bottom={0}
                left={0}
                gap={0}
                w='100%'
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)'
                }}
                p={20}
            >
                {
                    props.block.label ?
                        <Text
                            fz={14}
                            lh={'1.4'}
                            fw={700}
                            c='#ffffffc0'
                        >
                            {props.block.label}
                        </Text>
                        : null
                }
                {
                    props.block.source ?
                        <Text
                            fz={12}
                            lh={'1.4'}
                            fw={400}
                            c='#ffffff80'
                        >
                            Источник: <Anchor c='#ffffff80' size="12px" underline="hover" target="_blank" href={props.block.sourceUrl ?? ''}>{props.block.source}</Anchor>
                        </Text>
                        : null
                }
            </Stack>
        </HighlitedBlock>;

    return (
        <>
            {props.block.object3d ?
                <Object3dBlock blocktype={'image'} {...props.block.object3d} {...mainCategory.colors}>
                    <Image2d />
                </Object3dBlock>
                : <Image2d />}
        </>
    );
};

export default ImageBlock;
