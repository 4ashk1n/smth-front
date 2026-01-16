import { ActionIcon } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, type DropzoneProps, type FileWithPath } from "@mantine/dropzone";
import '@mantine/dropzone/styles.css';
import React, { useState } from "react";
import { PiImageDuotone, PiTrashDuotone, PiUploadDuotone, PiX } from "react-icons/pi";

type Props = {
    onImageLoad: (file: string) => void;
    onImageClear: () => void;
    style?: React.CSSProperties;
    dropzoneProps?: Partial<DropzoneProps>;
};

const ImageInput: React.FC<Props> = ({ onImageLoad, onImageClear, style, dropzoneProps }) => {
    const [file, setFile] = useState<FileWithPath | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);


    const handleImageLoad = (files: FileWithPath[]) => {
        setFile(files[0]);
        const fileURL = URL.createObjectURL(files[0]);
        setPreviewURL(fileURL);
        onImageLoad(fileURL);
    };

    const handleImageClear = () => {
        setFile(null);
        setPreviewURL(null);
        onImageClear();
    };

    return (
        <div style={{
            backgroundImage: previewURL ? `url(${previewURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...style
        }}>
            {
                file ?
                    <ActionIcon
                        size={'md'}
                        color={dropzoneProps?.c as string || 'white'}
                        pos={'absolute'}
                        top={0}
                        left={0}
                        autoContrast
                        onClick={handleImageClear}
                    >
                        <PiTrashDuotone onClick={onImageClear} />
                    </ActionIcon>
                    :
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
                            ...dropzoneProps?.style
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
            }

        </div>
    )
};

export default ImageInput;
