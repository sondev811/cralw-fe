import { useEffect, useState } from 'react';
import './App.css';
import httpService from './services/http.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [listUrl, setListUrl] = useState([]);
  const [buttonName, setButtonName] = useState('Crawl data');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await httpService.get('/getData');
    if (!response || !response.result || !response.result.data) return;
    setListUrl(response.result.data);
  }

  const handleDelete = async (data) => {
    const response = await httpService.post('/deleteData', data);
    if (!response || !response.result || !response.result.data) {
      showToast('Error while deleting data', false);
      return;
    }
    setListUrl(response.result.data);
    showToast('Successfully deleted', true);
  }

  const showToast = (message, status) => {
    if (status) {
      toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      return;
    }
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      }); 
  }

  const onSubmit = async () => {
    const form = document.getElementById('formData');
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data || !data.url || data.web === 'Select Type') {
      showToast('Input Link and type', false);
      return;
    }
    if (!data.url.split('/')[2].includes(data.web)) {
      showToast('Link is not of the same type', false);
      return;
    }
    const findUrl = listUrl.find(item => item.url === data.url);
    if (findUrl) {
      showToast('Link already exists', false);
      return;
    }
    const response = await httpService.post('/postData', data);
    if (!response || !response.result || !response.result.data) {
      showToast('Error while adding data', false);
      return;
    }
    setListUrl(response.result.data);
    showToast('Successfully added', true);
    
  }

  const crawlData = async () => {
    setButtonName('Crawling...');
    const response = await httpService.get('/crawl');
    setButtonName('Crawl data');
    if (!response || !response.status) {
      showToast('Error while crawling data', false);
      return;
    }
    showToast('Successfully crawled', true);
  }

  const startBot = async () => {
    await httpService.get('/startBot');
  }

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="wrapper">
        <div id="content">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">News Management</a>
            </div>
          </nav>
          <div className="container" id="main">
            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-lg-6 col-lg-offset-4">
                <form id="formData">
                  <div className="form-group row mb-3">
                    <label htmlFor="input-id" className="col-sm-3 col-form-label">Link</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" name="url" placeholder="Input link" />
                    </div>
                  </div>
                  <div className="form-group row mb-3">
                    <label htmlFor="input-type" className="col-sm-3 col-form-label">Type</label>
                    <div className="col-sm-9">
                      <select className="form-control" name='web'>
                        <option>Select Type</option>
                        <option>zing</option>
                        <option>cafef</option>
                        <option>cafebiz</option>
                      </select>
                    </div>
                  </div>
                  <div style={{"marginTop": "30px"}}>
                    <button onClick={onSubmit} type="button" className="btn btn-primary">Submit</button>
                    <button onClick={crawlData} type="button" className="btn btn-primary" style={{"marginLeft": "10px"}}>{buttonName}</button>
                    <button onClick={startBot} type="button" className="btn btn-primary" style={{"marginLeft": "10px"}}>Start bot</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="container" style={{"maxWidth": "90%", "marginTop": "30px"}}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Type</th>
                  <th scope="col">Link</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody id="tbody">
                {
                  listUrl.map((item, index) => {
                    return(
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.web}</td>
                        <td> <a href={item.url} target="_blank">{item.url}</a></td>
                        <td>
                            <button onClick={() => handleDelete(item)} type="button" className="btn btn-danger" id="submit-btn">Delete</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>		
        </div>
      </div>
    </div>
  );
}

export default App;
