
import React, { Component } from 'react';
import './index.css'
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      appointments:[],
      isLoaded: false,
      activeScreen: 'appointments',
      sellers: [], //List of all sellers
      selectedSeller: null, //Selected seller 
      slotDate: '',
      slotStartTime: '',
      slotEndTime: '',
      sellerName: "Select seller name",
      sellerId: null,
      searchResults:[],
      searchText:'',
      selectedUserEmail: 'Select user email',
      selectedUser: null,
      selectedUserName: '',
      selectedUserId: '',
      users:[]
    }
    this.handleSellerChange = this.handleSellerChange.bind(this);
    this.addSlotToSeller = this.addSlotToSeller.bind(this);
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.handleSellerSearch = this.handleSellerSearch.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  handleSlotChange(fieldName,value){
    switch(fieldName){
      case 'slotDate':
        this.setState({
         slotDate: value
        })
        break;
      case 'slotStartTime':
        this.setState({
            slotStartTime: value
        })
        break;
      case 'slotEndTime':
        this.setState({
            slotEndTime: value
        })
        break;
      default:
        break;
    }
  }
  handleUserChange(event){
    this.state.users.map(user => {
      if(user._id === event.target.value){
        this.setState({
          selectedUserEmail: user.email,   //update the state to the selected seller
          selectedUser: user,
          selectedUserId: user._id,
          selectedUserName:user.nameOfUser
        })
      } 
    })
  }
  handleSellerChange(event){
    //Fetches the slots for the selected seller from the backend
    this.state.sellers.map(seller => {
      if(seller._id === event.target.value){
        this.setState({
          sellerName: seller.name,   //update the state to the selected seller
          selectedSeller: seller,
          sellerId: seller._id
        })
      }
    })
    
    //Insert the code to fetch the timeslots of the sellers
  }
  addSlotToSeller(event){
    //Add the slot to the seller
    // console.log(this.state.selectedSeller);

    // console.log(this.state.slotDate + " +++ " + this.state.slotStartTime+ " +++ " + this.state.slotEndTime)
    fetch('http://localhost:4000/manageSlots/addSlots/'+ this.state.selectedSeller._id +'/'+this.state.slotDate+'/'+this.state.slotStartTime+'/'+this.state.slotEndTime)
        .then(res => res.json())
        .then((result) => {
          console.log(result);
          var tempObj = this.state.selectedSeller;
          tempObj.slots.push(result.data[0]);
          this.setState({
            slotDate: '',
            slotStartTime: '',
            slotEndTime: '',
            selectedSeller: tempObj
          })
        })
        .catch(error => {
          console.log(error)
        })
  }
  changeScreens(screenName){
    if(screenName === 'appointments'){
      this.fetchManageAppointments();
    }if(screenName === 'makeappointment'){
      this.fetchUsers();
    }else{
      this.fetchSellersData();
    }
    this.setState({
      activeScreen: screenName
    })
  }

  handleSellerSearch(searchTextVal){
    console.log(this.state.selectedUserId);
      if(this.state.selectedUser === null){
          alert('Please select the user')
      }else{
        this.setState({
          searchText: searchTextVal
        });
      }  
  }

  fetchSellers(e){
    fetch('http://localhost:4000/searchSeller/'+this.state.searchText)
        .then(res => res.json())
        .then((data) => {
            this.setState({
              isLoaded: true,
              searchResults: data
            })
        })
        .catch(error => {
          console.log(error)
        })
  }
  bookAppointment(sellerId,slotId,dateOfAppointment){
    var userId = this.state.selectedUserId;
    
    fetch('http://localhost:4000/bookAppointment/'+slotId+'/'+sellerId+'/'+dateOfAppointment+'/'+userId)
        .then(res => res.json())
        .then((data) => {
            this.changeScreens('appointments');
        })
        .catch(error => {
          console.log(error)
        })
  }

  processAppointment(e,statusOfAppointment,id){
    
    fetch('http://localhost:4000/manageAppointments/'+id+'/'+statusOfAppointment)
        .then(res => res.json())
        .then((data) => {
          this.setState(prevState => ({
            appointments: prevState.appointments.map(
              el => el._id === id? { ...el, status: statusOfAppointment }: el
            )
          }))
        })
        .catch(error => {
          console.log(error)
        })
  }
  fetchSellersData(){
    fetch('http://localhost:4000/fetchSellers')
        .then(res => res.json())
        .then((data) => {
            this.setState({
              isLoaded: true,
              sellers: data
            })
        })
        .catch(error => {
          console.log(error)
        })
  }
  fetchManageAppointments(){
    fetch('http://localhost:4000/fetchAppointments')
        .then(res => res.json())
        .then((data) => {
            this.setState({
              isLoaded: true,
              appointments: data
            })
        })
        .catch(error => {
          console.log(error)
        })
  }
  fetchUsers(){
    fetch('http://localhost:4000/fetchUsers')
        .then(res => res.json())
        .then((data) => {
            this.setState({
              isLoaded: true,
              users: data
            })
        })
        .catch(error => {
          console.log(error)
        })
  }
  // fetchManageSlots(){
  //   fetch('http://localhost:4000/fetchMaSlots')
  //       .then(res => res.json())
  //       .then((data) => {
  //           this.setState({
  //             isLoaded: true,
  //             appointments: data
  //           })
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       })
  // }
  componentDidMount(){
    this.fetchManageAppointments();
  }
  render() {
    var {isLoaded, appointments,activeScreen,sellers,selectedSeller,searchResults,users} = this.state;
    if(!isLoaded){
      return <div>Loading ...</div>
    }else{
      
      return (
        <div className="App container">
          <header className="App-header">
            <h1>Appointment Booking System</h1>
            
            <br/>
            <ul>
              <li onClick = { (e) => this.changeScreens('makeappointment')}>
                Make Appointment
              </li>
              <li onClick = { (e) => this.changeScreens('timeslots')}>
                Manage Time Slots
              </li>
              <li onClick = { (e) => this.changeScreens('appointments')}>
                Manage Appointments
              </li>
            </ul>
          </header>
          {
            activeScreen === 'makeappointment' && (
              <div className="makeAppointments">
                <h3>Manage Timeslots</h3>
              <hr/>
              <div>
                 <label>Please select a user email:</label>
                 <select value={this.state.selectedUserId} onChange={(e) => this.handleUserChange(e)}>
                 <option>{this.state.selectedUserName} - {this.state.selectedUserEmail}</option>
                  {
                    users.map(user => (
                      <option key={user._id} value={user._id}>{user.nameOfUser} - {user.email}</option>
                    ))
                  }
                   
                 </select>
              </div>
              <div className="content">
                <input className="form-control" type="text" value={this.state.searchText} onChange={(e) =>this.handleSellerSearch(e.target.value)} placeholder="Type to search the seller" aria-label="default input example"/>
                <br/>
                <button type="button" className="btn btn-success" onClick = { (e) => this.fetchSellers(e)}>Search</button>
              </div>
              <div className="searchResults">
              <table className="table">
              <thead>
                <tr>
                  <th scope="col">Seller Name</th>
                  <th scope="col">Slots</th>
                </tr>
              </thead>
              <tbody>
                {
                  searchResults.map(result => (
                    <tr key={result._id}>
                      <td>{result.name}</td>
                      <td className="slotInteraction">
                        {
                          result.slots.map(slot => (
                            <div key={slot.id}>
                              <label>{slot.slotDate} - </label>
                              <span onClick = { (e) => this.bookAppointment(result._id,slot.id,slot.slotDate)} className="slotTag badge bg-secondary">{slot.slotStart} - {slot.slotEnd}</span>
                            </div>
                          ))
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
              </div>
              </div>

            )
          }
          { activeScreen === 'timeslots' && (
            <div className="manageSlots">
              <h3>Manage Timeslots</h3>
              <hr/>
              <div>
                 <label>Please select a seller:</label>
                 <select value={this.state.sellerName} onChange={this.handleSellerChange}>
                 <option>{this.state.sellerName}</option>
                  {
                    sellers.map(seller => (
                      <option key={seller._id} value={seller._id}>{seller.name}</option>
                    ))
                  }
                   
                 </select>
              </div>
              <div>
                 <label>Please Select a date:</label>
                 <input type="date" value={this.state.slotDate} onChange={(e) =>this.handleSlotChange('slotDate',e.target.value)}></input> &nbsp;&nbsp;
                 <label>Enter slot start time: </label>
                 <input placeholder="In hh:mm AM/PM" type="text" value={this.state.slotStartTime} onChange={(e) =>this.handleSlotChange('slotStartTime',e.target.value)}></input> &nbsp;&nbsp;
                 <label>Enter slot end time: </label>
                 <input placeholder="In hh:mm AM/PM" type="text" value={this.state.slotEndTime} onChange={(e) =>this.handleSlotChange('slotEndTime',e.target.value)}></input> &nbsp;&nbsp;
                 <button className="btn btn-success" onClick = { (e) => this.addSlotToSeller(e)}> ADD </button>
              </div>
              <div className="Existing Slots">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Start Time </th>
                      <th scope="col">End Time</th>
                      {/* <th scope="col">Appointments</th> */}
                      <th scope="col">Status</th>
                      {/* <th scope="col"> */}
                          {/* Actions */}
                      {/* </th> */}
                    </tr>
                  </thead>
                  <tbody>
                  { 
                    selectedSeller != null && (
                    selectedSeller.slots.map(slot => (
                        <tr key={slot.id}>
                        <td>{slot.slotDate}</td>
                        <td>{slot.slotStart}</td>
                        <td>{slot.slotEnd}</td>
                        {/* <td>{slot.numberOfAppointments}</td> */}
                        <td>{slot.isActive === 1? 'active': 'inactive'}</td>
                        {/* <td> */}
                          {/* {/* <button className="btn btn-success">Edit</button> &nbsp;&nbsp; */}
                          {/* <button className="btn btn-success">Delete</button> &nbsp;&nbsp; */}
                          {/* <button className="btn btn-success">Activate / Deactivate</button> */} 
                        {/* </td> */}
                    </tr>
                    ))
                    
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          { activeScreen === 'appointments' && (
          <div className="searchResults">
            <h3>Appointment Requests</h3>
            <hr/>
            <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">User name</th>
                <th scope="col">Slot requested</th>
                <th scope="col">Date Of Appointment</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {
                appointments.map(appointment => (
                    <tr key={appointment._id}>
                      <td>1</td>
                      <td>{appointment.user_details[0].nameOfUser}</td>
                      <td>{appointment.appointment_details.slots.slotTimings.slotStart} to {appointment.appointment_details.slots.slotTimings.slotEnd}</td>
                      <td>{appointment.appointment_details.slots.slotDate}</td>
                      <td>
                        { appointment.status === 'pending' && (
                            <div>
                              <button type="button" className="btn btn-success" onClick = { (e) => this.processAppointment(e,'approved',appointment._id)} >Approve</button> &nbsp;&nbsp;
                            <button type="button" className="btn btn-success" onClick = { (e) => this.processAppointment(e,'rejected',appointment._id)}>Reject</button>
                            </div>
                          )}
                        { appointment.status === 'approved' && (
                            <div>
                              <button type="button" className="btn btn-success" >Approved</button>
                            </div>
                          )}
                          { appointment.status === 'rejected' && (
                            <div>
                              <button type="button" className="btn btn-success" >Rejected</button>
                            </div>
                          )}
                        
                      </td>
                    </tr>
                ))
              }
                
            </tbody>
            </table>
          </div>
          )}
        </div>
      );
    }
  }
}

export default App


