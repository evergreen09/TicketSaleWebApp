import { useState } from 'react'
import './App.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


function App() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [name, setName] = useState('')
  const [purposeOfVisit, setPurpose] = useState('')
  const [newUserID, setNewUserID] = useState('')
  const [status, setStatus] = useState('')
  const [ticketNumber, setTicket] = useState(0)
  const [saleData, setSaleData] = useState([])

  const handleInputChange = (event) => {
    setUserId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  
  const handlePurposeChange = (event) => {
    setPurpose(event.target.value)
  }

  const handleNewUserIdChange = (event) => {
    setNewUserID(event.target.value)
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value)
  }

  const handleEnterPress = (event) => {
    if (event.key === 'Enter' && userId.trim() !== '') {
      fetchUserData();
    }
  };

  const fetchUserData = () => {
    const tempValue = userId
    setUserId('')
    fetch(`http://127.0.0.1:5000/find_user/${tempValue}`)
      .then(response => {
        if (!response.ok) {
          alert('Failed');
          throw new Error('Network response was not ok');
        }
        getTicketNumber();
        return response.json();
      })
      .catch(error => {
        setError(error);
      });
  };

  const refundTicket = () => {
    const tempValue = userId;
    setUserId('');
    fetch(`http://127.0.0.1:5000/refund_ticket/${tempValue}`, {
      method: 'DELETE',
      
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } 
        setUserId('');
        getTicketNumber();
        return response.json();
      })
      .catch(error => {
        setError(error);
      });
  };

  const nonMember = () => {    
    fetch(`http://127.0.0.1:5000/non_member/${name}/${purposeOfVisit}`, {
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        setName('');
        setPurpose();
        getTicketNumber();
        return response.json();
      })
      .catch(error => {
        setError(error);
      });
    }

  const addNewUser = () => {
    fetch(`http://127.0.0.1:5000/add_new_user/${newUserID}/${name}/${status}`, {
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        setNewUserID('');
        setName('');
        setStatus('');
        getTicketNumber();
        return response.json();
      })
      .catch(error => {
        setError(error);
      });
  }

  const getTicketNumber = () => {
    fetch('http://127.0.0.1:5000/get_ticket_number', {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data); // Debugging line
        // Assuming the server returns { "message": ticketNumber }
        if (data.message !== undefined) {
          setTicket(data.message - 1); // Set the ticketNumber state
        } else {
          console.error('Unexpected response format:', data);
          setError(new Error('Unexpected response format'));
      }
      })
      .catch(error => {
        setError(error);
      });
  }

  const resetTicketNumber = () => {
    tempValue = userId;
    setUserId('');
    fetch(`http://127.0.0.1:5000/reset_ticket_number/${tempValue}`, {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        getTicketNumber();
        return response.json();
      })
      .catch(error => {
        setError(error);
      });
  }

  const getSaleData = () => {
    fetch('http://127.0.0.1:5000/get_sale_data', {
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        return response.json();
      })
      .then(data => {
        setSaleData(data.message.reverse())
      })
      .catch(error => {
        setError(error);
      });
  }

  const saveExcel = () => {
    fetch(`http://127.0.0.1:5000/save_file`, {
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        return response.json();
      })
      .catch(error => {
        setError(error);
      });
  }

  return (
    <div>
      <h1>식권</h1>
      <input
        type="text"
        value={userId}
        onChange={handleInputChange}
        onKeyDown={handleEnterPress}
        placeholder="Enter User ID"
      />
      <button onClick={fetchUserData}>검색</button>
      <button onClick={refundTicket}>환불</button>
      <Popup trigger=
        {<button>신규회원 추가</button>}
        modal nested>
          {
            close => (
              <div>
                <input
                  type='text'
                  value={newUserID}
                  onChange={handleNewUserIdChange}
                  placeholder='회원번호 입력'
                />
                <input
                  type='text'
                  value={name}
                  onChange={handleNameChange}
                  placeholder='신규회원 이름'
                />
                <input
                  type='text'
                  value={status}
                  onChange={handleStatusChange}
                  placeholder='생활구분 입력'
                />
                <button onClick={addNewUser}>신규회원 추가</button>
                <button onClick=
                {() => close()}>
                  Close
                </button>
              </div>
            )
          }
        </Popup>
      <Popup trigger=
        {<button>비회원</button>}
        modal nested>
          {
            close => (
              <div>
                <input
                  type='text'
                  value={name}
                  onChange={handleNameChange}
                  placeholder='비회원 이름 입력'
                />
                <input
                  type='text'
                  value={purposeOfVisit}
                  onChange={handlePurposeChange}
                  placeholder='방문용무'
                />
                <button onClick={nonMember}>비회원 식권 판매</button>
                <button onClick=
                {() => close()}>
                  Close
                </button>
              </div>
            )
          }
        </Popup>  
      <button onClick={resetTicketNumber}>식권번호변경</button>
      <button onClick={saveExcel}>저장</button>
      <button onClick={getSaleData}>DEBUG</button>
      <h2>{ticketNumber}</h2>
      {error && <div>Error: {error.message}</div>}
      <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>User Name</th>
          <th>Status</th>
          <th>Price</th>
          <th>Ticket Number</th>
        </tr>
      </thead>
      <tbody>
        {saleData.map((item, index) => (
          <tr key={index}>
            <td>{item.userID}</td>
            <td>{item.name}</td>
            <td>{item.status}</td>
            <td>{item.price}</td>
            <td>{item.ticketNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default App
