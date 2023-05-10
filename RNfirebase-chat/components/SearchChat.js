import { Searchbar } from "react-native-paper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsersBySearch } from "../stores/usersSlice";
import showToast from "../helper/showToast";

export function SearchChat() {
  const [searchUsername, setSearchUsername] = useState("");
  const dispatch = useDispatch();

  function handleSearch() {
    dispatch(fetchUsersBySearch(searchUsername))
    .unwrap()
    .catch(err => showToast("error", "Fetch Data Error", err.message));
  }

  return (
    <>
      <Searchbar
        value={searchUsername}
        onChangeText={(value) => setSearchUsername(value)}
        onSubmitEditing={handleSearch}
        placeholder="Search"
        style={{ flex: 1, width: 70 }}
      />
    </>
  );
}
