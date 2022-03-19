import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Upload, Button } from "@arco-design/web-react";
import { UploadItem } from "@arco-design/web-react/es/Upload";
import { setAddressArray } from "reducers/globalSlice";
import { AddressAmount } from "utils";
import "./index.scss";

export default function FileUpload() {
  const [fileList, setFileList] = useState<UploadItem[]>([]);
  const dispatch = useDispatch();

  const parseFile = useCallback(() => {
    const reader = new FileReader();
    const file = fileList[0].originFile as Blob;
    reader.readAsText(file);
    reader.onload = function () {
      const addressAmountParsed = csvToArray(reader.result as string);
      const addressAmountArray = splitAmountArray(addressAmountParsed);
      dispatch(setAddressArray(addressAmountArray));
    };
  }, [dispatch, fileList]);

  useEffect(() => {
    if (!fileList.length) return;
    parseFile();
  }, [fileList, dispatch, parseFile]);

  return (
    <Upload
      showUploadList={false}
      className="file-upload"
      fileList={fileList}
      onChange={setFileList}
      accept=".csv"
    >
      <Button>Add addresses</Button>
    </Upload>
  );
}

function csvToArray(csv: string): string[] {
  csv = csv.replaceAll('\r', '') // for windows line ending
  const parsedCsv = csv.split("\n");
  console.log(parsedCsv)
  if (parsedCsv[parsedCsv.length - 1] === "") parsedCsv.pop();
  return parsedCsv;
}

function splitAmountArray(addressAmountParsed: string[]): AddressAmount[] {
  const res: AddressAmount[] = [];
  let temp: string[] = [];
  for (let addressAmountInfo of addressAmountParsed) {
    temp = addressAmountInfo.split(",");
    res.push({
      address: temp[0],
      amount: Number(Number(temp[1])),
    });
  }
  return res;
}
