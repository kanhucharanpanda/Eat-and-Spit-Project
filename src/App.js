import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friend, setNewFriend] = useState(initialFriends);
  const [ShowAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  //for showing the new friend
  function handleAddFriend() {
    setShowAddFriend((show) => !show);
  }
  //for adding a new friend
  function handleFriend(friend) {
    setNewFriend((fris) => [...fris, friend]);
    setShowAddFriend(false);
  }
  //for selecting the friend
  function SelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  //
  function handleSplitBill(value) {
    console.log(value);
    setNewFriend((Friends) =>
      Friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    //setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friend={friend}
          onSelectFriend={SelectFriend}
          selectedFriend={selectedFriend}
        />
        {ShowAddFriend && <FormAddFriend onAddFriend={handleFriend} />}

        <Button onClick={handleAddFriend}>
          {ShowAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormBillSplit
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friend, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friend.map((fri) => (
        <Friends
          friend={fri}
          key={fri.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friends({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : " "}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You ows {friend.name} {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} ows you {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image} ?=${id}`,
      id,
      balance: 0,
    };
    console.log(newFriend);
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=933372");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormBillSplit({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const FriendsBill = bill ? bill - paidByUser : " ";
  const [whoIspaying, setWhoIsPaying] = useState("");

  function handleSubmitSplitBill(e) {
    e.preventDefault();

    if (!bill && !paidByUser) return;

    onSplitBill(whoIspaying === "user" ? FriendsBill : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmitSplitBill}>
      <h3>Split a bill with {selectedFriend.name}</h3>
      <br />

      <label> 💰Bill Value:-</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label> 💴Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🙍‍♂️{selectedFriend.name} Expense</label>
      <input type="text" disabled value={FriendsBill} />

      <label>🤑Who is paying the Bill</label>
      <select
        value={whoIspaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="frieend">Friend</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
