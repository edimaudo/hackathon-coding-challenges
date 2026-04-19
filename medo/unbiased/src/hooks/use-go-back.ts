import { useNavigate } from "react-router-dom";
2
3const useGoBack = () => {
4  const navigate = useNavigate();
5
6  const goBack = () => {
7    if (window.history.state && window.history.state.idx > 0) {
8      navigate(-1); // Go back to the previous page
9    } else {
10      navigate("/"); // Redirect to home if no history exists
11    }
12  };
13
14  return goBack;
15};
16
17export default useGoBack;