import { useEffect, useState } from "react";
import {
    TextField,
    Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import ProcessHeaderWithNote from "../../Components/ProcessHeaderWithNote";
import TimerSection from "../../Components/TimerSection";
import FormTitle from "../../Components/FormTitle";
import ExtractedDataTableOfPO from "./ExtractedDataTableForPO";
import MessageTable from "./MessegeTable";
import UploadedFileDataOfPO from "./UploadedFileDataOfPO";
import POUploadedFileList from "./POUploadedFileList";

export const process = '6570b1edbf66fc48333c8828';

const POExtraction = () => {
    const [reload, setReload] = useState(false);
    const [folderPath, setFolderPath] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [engineStatus, setEngineStatus] = useState(null);
    const [isStartVisible, setIsStartVisible] = useState(false);
    const [uploadedFilesSelectedData, setUploadedFilesSelectedData] = useState({});

    const handleSetFolderPath = async () => {
        const filePath = await window.engine.openFile(
            { title: "Select Folder of PO PDFs", accept: ['openDirectory'] }
        );
        if (filePath?.success === true) {
            setFolderPath(filePath?.path?.[0]);
            setIsStartVisible(true);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();

        const data = { pid: process, dir: folderPath };
        const p = await window.engine.startProcess(data);
        console.log(p)
        if (p.success === true) {
            setEngineStatus('Started');
            setIsLoading(true);
        }
        else {
            setEngineStatus('Start Failed');
        }
    };

    const handleStop = async () => {
        const p = await window.engine.stopProcess();
        if (p.success === true) {
            setEngineStatus('Stopped');
            setIsLoading(false);
        }
    }

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log("message stop", message);
        });
    }

    const getEngineOffSignal = () => {
        window.engine.onProcessStop(function (message) {
            console.log("message start", message);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getEngineOffSignal()
    }, [])

    return (
        <div className="relative">
            <div className="justify-center flex z-50">
                {/* <ProcessHeader /> */}
                <ProcessHeaderWithNote
                    title="PO EXTRACTION"
                    note={"No instructions added yet."}
                />
            </div>
            <div className="flex justify-center">
                <form
                    onSubmit={handleStart}
                    className="flex flex-col items-center gap-3 justify-center bg-white p-4 rounded-md"
                >
                    <div className="flex justify-start items-center gap-2">
                        <FormTitle text={"File path"} isCompulsory={true} length={70} />
                        <div className="w-[30vw] mx-auto relative">
                            <TextField
                                size="small"
                                name="folderPath"
                                variant="outlined"
                                value={folderPath}
                                placeholder="Select file path"
                                sx={{
                                    width: "100%",
                                    overflow: "hidden",
                                    "& .MuiInputBase-root": {
                                        height: 25,
                                        fontSize: 14,
                                    },
                                }}
                                inputProps={{ readOnly: true }}
                                className="editableInput"
                            />
                            <Button
                                sx={{
                                    position: "absolute",
                                    right: "1px",
                                    height: "94%",
                                    width: "6px",
                                    marginTop: "1px",
                                    bgcolor: "white",
                                    color: "#283e8a",
                                    ":hover": {
                                        color: "white",
                                    },
                                }}
                                component="label"
                                variant="contained"
                                onClick={handleSetFolderPath}
                            >
                                <DriveFolderUploadIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <LoadingButton
                            size="small"
                            sx={{
                                height: 25,
                            }}
                            type="submit"
                            disabled={!isStartVisible}
                            // loading={isProcessing}
                            variant="contained"
                            loadingIndicator="Processing…"
                        >
                            <span>Start Extracting</span>
                        </LoadingButton>
                        <Button
                            onClick={handleStop}
                            variant="contained"
                            size="small"
                            sx={{
                                height: 25,
                            }}
                            color="error"
                        >
                            Stop
                        </Button>
                    </div>
                </form>
            </div>
            <div className="flex gap-2">
                <TimerSection
                    isDataToRun={true}
                    dataToRunText={'PO To Extract'}
                    isSuccess={true}
                    successText={"Extracted"}
                    isFaild={true}
                    engineStatus={engineStatus}
                />
                <MessageTable />
            </div>
            <ExtractedDataTableOfPO
                setReload={setReload}
                isReadyToUpload={isLoading}
            />
            <POUploadedFileList
                reload={reload}
                setReload={setReload}
                setUploadedFilesSelectedData={setUploadedFilesSelectedData}
            />
            {uploadedFilesSelectedData && (
                <UploadedFileDataOfPO
                    uploadedFilesSelectedData={uploadedFilesSelectedData}
                    setUploadedFilesSelectedData={setUploadedFilesSelectedData}
                />
            )}
        </div>
    )
}

export default POExtraction;