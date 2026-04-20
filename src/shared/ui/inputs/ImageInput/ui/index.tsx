import { ActionIcon } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, type DropzoneProps, type FileWithPath } from "@mantine/dropzone";
import '@mantine/dropzone/styles.css';
import React, { useEffect, useMemo, useState } from "react";
import { PiImageDuotone, PiTrashDuotone, PiUploadDuotone, PiX } from "react-icons/pi";

type Props = {
    onImageLoad: (fileUrl: string, file: FileWithPath) => void;
    onImageClear: () => void;
    valueUrl?: string | null;
    style?: React.CSSProperties;
    dropzoneProps?: Partial<DropzoneProps>;
    showClearButton?: boolean;
    allowReplace?: boolean;
};

const ImageInput: React.FC<Props> = ({
    onImageLoad,
    onImageClear,
    valueUrl,
    style,
    dropzoneProps,
    showClearButton = true,
    allowReplace = false,
}) => {
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    const displayedUrl = useMemo(() => previewURL || valueUrl || null, [previewURL, valueUrl]);

    const handleImageLoad = (files: FileWithPath[]) => {
        const selectedFile = files[0];
        if (!selectedFile) return;

        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        const fileURL = URL.createObjectURL(selectedFile);
        setPreviewURL(fileURL);
        onImageLoad(fileURL, selectedFile);
    };

    const handleImageClear = () => {
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        setPreviewURL(null);
        onImageClear();
    };

    useEffect(() => {
        return () => {
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL]);

    return (
        <div
            style={{
                backgroundImage: displayedUrl ? `url(${displayedUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...style,
            }}
        >
            {displayedUrl ? (
                <>
                    {showClearButton ? (
                        <ActionIcon
                            size={'md'}
                            color={(dropzoneProps?.c as string) || 'white'}
                            pos={'absolute'}
                            top={0}
                            left={0}
                            autoContrast
                            onClick={handleImageClear}
                            style={{ zIndex: 2 }}
                        >
                            <PiTrashDuotone />
                        </ActionIcon>
                    ) : null}

                    {allowReplace ? (
                        <Dropzone
                            accept={IMAGE_MIME_TYPE}
                            bg='transparent'
                            multiple={false}
                            onDrop={handleImageLoad}
                            activateOnDrag
                            activateOnClick
                            style={{
                                position: "absolute",
                                inset: 0,
                                opacity: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                                ...dropzoneProps?.style,
                            }}
                            {...dropzoneProps}
                        >
                            <></>
                        </Dropzone>
                    ) : null}
                </>
            ) : (
                <Dropzone
                    accept={IMAGE_MIME_TYPE}
                    bg='transparent'
                    multiple={false}
                    onDrop={handleImageLoad}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        ...dropzoneProps?.style,
                    }}
                    {...dropzoneProps}
                >
                    <Dropzone.Accept>
                        <PiUploadDuotone size={52} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <PiX size={52} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <PiImageDuotone size={52} />
                    </Dropzone.Idle>
                </Dropzone>
            )}
        </div>
    );
};

export default ImageInput;
