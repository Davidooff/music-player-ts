import { useCallback, useEffect, useState } from "react";
import "./css/login.scss";
import useAxios from "axios-hooks";

function Login() {
  return (
    <section className="login">
      <div className="login--content">
        <h1>
          MUSIC<span>.DS</span>
        </h1>
        <Form />
      </div>
    </section>
  );
}

function Form() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [{ data, loading, error }, refetch] = useAxios('http://localhost:3000/auth/register', {
    manual: true
  });

  const submitAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form 
      className="login--form"
      onSubmit={submitAction}
    >
      <Input isPassword={false} setInput={setLogin}></Input>
      <Input isPassword={true} setInput={setPassword}></Input>
      <div className="form-btns">
        <button className="login-btn btn">Log in</button>
        <button className="register-btn btn">Sign up</button>
      </div>
    </form>
  );
}

function Input(props: {
  isPassword: boolean;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isSecure, setIsSecure] = useState(props.isPassword);
  return (
    <label
      id={props.isPassword ? "Password" : "Login"}
      className="login--lable__input"
    >
      {props.isPassword ? "Password*" : "Login*"}
      <input
        className="login--input"
        type={isSecure ? "password" : "text"}
        onChange={(e) => props.setInput(e.target.value)}
      />

      {props.isPassword ? (
        <div
          className="password--eye"
          onClick={() => {
            setIsSecure(!isSecure);
          }}
        >
          {isSecure ? <SecureEyeSvg /> : <UnSecureEyeSvg />}
        </div>
      ) : (
        ""
      )}
    </label>
  );
}

function SecureEyeSvg() {
  const Secure = (
    <svg
      width="32px"
      height="32px"
      version="1.1"
      viewBox="0 0 700 700"
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
    >
      <path
        d="m234.91 411.59-109.99 109.99-16.5-16.5 105.6-105.6c-14.258-8.9102-28.344-19.023-42.176-30.195-41.27-33.332-78.512-75.957-78.512-89.285s37.242-55.953 78.512-89.285c56.922-45.969 118.13-74.047 178.16-74.047 38.359 0 77.199 11.465 115.09 31.738l109.99-109.99 16.5 16.5-105.6 105.6c14.258 8.9102 28.344 19.023 42.176 30.195 41.27 33.332 78.512 75.957 78.512 89.285s-37.242 55.953-78.512 89.285c-56.922 45.969-118.13 74.047-178.16 74.047-38.359 0-77.199-11.465-115.09-31.738zm17.32-17.32c32.703 16.52 65.727 25.727 97.773 25.727 53.793 0 110.35-25.941 163.5-68.867 19.977-16.137 38.242-33.801 52.559-50.188 5.8945-6.7461 10.77-12.898 14.113-17.727 1.8438-2.6562 3.1641-5.1523 3.1641-3.2188s-1.3203-0.5625-3.1641-3.2188c-3.3438-4.8281-8.2188-10.98-14.113-17.727-14.316-16.387-32.582-34.051-52.559-50.188-14.617-11.805-29.488-22.324-44.492-31.371l-45.273 45.27c12.285 15.805 19.602 35.668 19.602 57.234 0 51.547-41.785 93.332-93.332 93.332-21.566 0-41.43-7.3164-57.234-19.602zm-21.23-11.77 45.273-45.27c-12.285-15.805-19.602-35.668-19.602-57.234 0-51.547 41.785-93.332 93.332-93.332 21.566 0 41.43 7.3164 57.234 19.602l40.539-40.543c-32.703-16.52-65.727-25.727-97.773-25.727-53.793 0-110.35 25.941-163.5 68.867-19.977 16.137-38.242 33.801-52.559 50.188-5.8945 6.7461-10.77 12.898-14.113 17.727-1.8438 2.6562-3.1641 5.1523-3.1641 3.2188s1.3203 0.5625 3.1641 3.2188c3.3438 4.8281 8.2188 10.98 14.113 17.727 14.316 16.387 32.582 34.051 52.559 50.188 14.617 11.805 29.488 22.324 44.492 31.371zm78.445-45.445c11.441 8.1484 25.441 12.941 40.559 12.941 38.66 0 70-31.34 70-70 0-15.117-4.793-29.117-12.941-40.559zm-16.5-16.5 97.617-97.617c-11.441-8.1484-25.441-12.941-40.559-12.941-38.66 0-70 31.34-70 70 0 15.117 4.793 29.117 12.941 40.559z"
        stroke="#ffffff"
      />
    </svg>
  );

  return Secure;
}
function UnSecureEyeSvg() {
  const UnSecure = (
    <svg
      width="32px"
      height="32px"
      version="1.1"
      viewBox="0 0 700 700"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m350 443.33c-60.027 0-121.23-28.078-178.16-74.047-41.27-33.332-78.512-75.957-78.512-89.285s37.242-55.953 78.512-89.285c56.922-45.969 118.13-74.047 178.16-74.047s121.23 28.078 178.16 74.047c41.27 33.332 78.512 75.957 78.512 89.285s-37.242 55.953-78.512 89.285c-56.922 45.969-118.13 74.047-178.16 74.047zm0-23.332c53.793 0 110.35-25.941 163.5-68.867 19.977-16.137 38.242-33.801 52.559-50.188 5.8945-6.7461 10.77-12.898 14.113-17.727 1.8438-2.6562 3.1641-5.1523 3.1641-3.2188s-1.3203-0.5625-3.1641-3.2188c-3.3438-4.8281-8.2188-10.98-14.113-17.727-14.316-16.387-32.582-34.051-52.559-50.188-53.148-42.926-109.7-68.867-163.5-68.867s-110.35 25.941-163.5 68.867c-19.977 16.137-38.242 33.801-52.559 50.188-5.8945 6.7461-10.77 12.898-14.113 17.727-1.8438 2.6562-3.1641 5.1523-3.1641 3.2188s1.3203 0.5625 3.1641 3.2188c3.3438 4.8281 8.2188 10.98 14.113 17.727 14.316 16.387 32.582 34.051 52.559 50.188 53.148 42.926 109.7 68.867 163.5 68.867zm0-46.668c-51.547 0-93.332-41.785-93.332-93.332s41.785-93.332 93.332-93.332 93.332 41.785 93.332 93.332-41.785 93.332-93.332 93.332zm0-23.332c38.66 0 70-31.34 70-70s-31.34-70-70-70-70 31.34-70 70 31.34 70 70 70z" />
    </svg>
  );
  return UnSecure;
}

export default Login;
