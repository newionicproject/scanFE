/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import './MultiFileUpload.scss'
export const MultiFileUpload = () => {

    const [selectedfile, SetSelectedFile] = useState<any>([]);
    const [Files, SetFiles] = useState<any>([]);


    const filesizes = (bytes:any, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const InputChange = (e:any) => {
        // --For Multiple File Input
        const images:any = [];
        for (let i = 0; i < e.target.files.length; i++) {
            images.push((e.target.files[i]));
            const reader = new FileReader();
            const file = e.target.files[i];
            reader.onloadend = () => {
                SetSelectedFile((preValue:any) => {
                    return [
                        ...preValue,
                        {
                            id:"id"+i,
                            filename: e.target.files[i].name,
                            filetype: e.target.files[i].type,
                            fileimage: reader.result,
                            datetime: e.target.files[i].lastModifiedDate.toLocaleString('en-IN'),
                            filesize: filesizes(e.target.files[i].size)
                        }
                    ]
                });
            }
            if (e.target.files[i]) {
                reader.readAsDataURL(file);
            }
        }
    }


    const DeleteSelectFile = (id:any) => {
        if(window.confirm("Are you sure you want to delete this Image?")){
            const result = selectedfile.filter((data:any) => data.id !== id);
            SetSelectedFile(result);
        }else{
            // alert('No');
        }
        
    }

    const FileUploadSubmit = async (e:any) => {
        e.preventDefault();

        // form reset on submit 
        e.target.reset();
        if (selectedfile.length > 0) {
            for (let index = 0; index < selectedfile.length; index++) {
                SetFiles((preValue:any)=>{
                    return[
                        ...preValue,
                        selectedfile[index]
                    ]   
                })
            }
            SetSelectedFile([]);
        } else {
            alert('Please select file')
        }
    }


    const DeleteFile = async (id:any) => {
        if(window.confirm("Are you sure you want to delete this Image?")){
            const result = Files.filter((data:any)=>data.id !== id);
            SetFiles(result);
        }else{
            // alert('No');
        }
    }
  return (
    <div className='multiFileUpload'>

<div className="fileupload-view">
                <div className="row justify-content-center m-0">
                    <div className="col-md-6">
                        <div className="card mt-5">
                            <div className="card-body">
                                <div className="kb-data-box">
                                    <div className="kb-modal-data-title">
                                        <div className="kb-data-title">
                                            <h6>Multiple File Upload With Preview</h6>
                                        </div>
                                    </div>
                                    <form onSubmit={FileUploadSubmit}>
                                        <div className="kb-file-upload">
                                            <div className="file-upload-box">
                                                <input type="file" id="fileupload" className="file-upload-input" onChange={InputChange} multiple />
                                                <span>Drag and drop or <span className="file-link">Choose your files</span></span>
                                            </div>
                                        </div>
                                        <div className="kb-attach-box mb-3">
                                            {
                                                selectedfile.map((data:any ) => {
                                                    const { id, filename, fileimage, datetime, filesize } = data;
                                                    return (
                                                        <div className="file-atc-box" key={id}>
                                                            {
                                                                filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ?
                                                                    <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                                    <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                            }
                                                            <div className="file-detail">
                                                                <h6>{filename}</h6>
                                                                <p></p>
                                                                <p><span>Size : {filesize}</span><span className="ml-2">Modified Time : {datetime}</span></p>
                                                                <div className="file-actions">
                                                                    <button type="button" className="file-action-btn" onClick={() => DeleteSelectFile(id)}>Delete</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="kb-buttons-box">
                                            <button type="submit" className="btn btn-primary form-submit">Upload</button>
                                        </div>
                                    </form>
                                    {Files.length > 0 ?
                                        <div className="kb-attach-box">
                                            <hr />
                                            {
                                                Files.map((data:any, index:number) => {
                                                    const { id, filename, fileimage, datetime, filesize } = data;
                                                    return (
                                                        <div className="file-atc-box" key={index}>
                                                            {
                                                                filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ?
                                                                    <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                                    <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                            }
                                                            <div className="file-detail">
                                                                <h6>{filename}</h6>
                                                                <p><span>Size : {filesize}</span><span className="ml-3">Modified Time : {datetime}</span></p>
                                                                <div className="file-actions">
                                                                    <button className="file-action-btn" onClick={() => DeleteFile(id)}>Delete</button>
                                                                    <a href={fileimage}  className="file-action-btn" download={filename}>Download</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


    </div>
  )
}
