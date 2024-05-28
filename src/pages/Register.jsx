import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [regst, setRegst] = useState(true);

  const navigate = useNavigate();

  const isValidate = () => {
    let isProceed = true;
    let errorMessage = "";

    if (name.length === 0) {
      isProceed = false;
      errorMessage = "введите имя";
    } else if (lastname.length === 0) {
      isProceed = false;
      errorMessage = "введите фамилию";
    } else if (email.length === 0) {
      isProceed = false;
      errorMessage = "введите почту";
    } else if (phone.length < 4) {
      isProceed = false;
      errorMessage = "введите номер";
    } else if (password.length < 6) {
      isProceed = false;
      errorMessage = "введите пароль";
    } else if (confirmPassword.length < 6) {
      isProceed = false;
      errorMessage = "повторите пароль";
    } else if (password !== confirmPassword) {
      isProceed = false;
      errorMessage = "пароль не подходит";
    }

    if (!isProceed) {
      toast.warn(errorMessage);
    }

    return isProceed;
  };
  const checkcode = () => {
    let regObj = {
      id: nanoid(),
      name,
      lastname,
      email,
      phone,
      adress,
      password,
      userWishlist: [],
      cart:[],
    };
    fetch(`${process.env.REACT_APP_API_URL}/user/checkmailend`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, email }), // Передача кода и электронной почты
    })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.message);
        });
      }
      fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(regObj),
      })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }
        navigate("/login");
      })
      .catch((err) => {
        toast.error("ошибка: " + err.message);
      });
    })
    .catch((err) => {
      // Обработка ошибки при проверке кода
      console.error("Ошибка при проверке кода:", err);
      toast.error("ошибка: " + err.message); // Отображение ошибки
    });
  };
  


  const handleSubmit = (e) => {
    e.preventDefault();

    let regObj = {
      id: nanoid(),
      name,
      lastname,
      email,
      phone,
      adress,
      password,
      userWishlist: [],
      cart:[],
    };
    if (isValidate()) {
      fetch(`${process.env.REACT_APP_API_URL}/user/checkmailstart`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: regObj.email }),
      })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }

        setRegst(false);
      })
      .catch((err) => {
        toast.error("ошибка: " + err.message);
      });
    }
  };


  return (
    <>
      <div className="flex flex-col justify-center sm:py-12">
      {regst ? (
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-dark border border-gray-600 shadow w-full rounded-lg divide-y divide-gray-200">
            <form className="px-5 py-7" onSubmit={handleSubmit}>
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Имя
              </label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Фамилия
              </label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Почта
              </label>
              <input
                type="email"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Мобильный номер
              </label>
              <input
                type="tel"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Пароль
              </label>
              <input
                type="password"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Повторите пароль
              </label>
              <input
                type="password"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="transition duration-200 bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Зарегистрироваться</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </form>
          </div>
          <div className="py-5 text-center">
            <Link
              to="/login"
              className="btn btn-neutral text-white"
              onClick={() => window.scrollTo(0, 0)}
            >
              Войти
            </Link>
          </div>
        </div>
      ) : ( <div className="py-5 text-center px-5 py-7 p-10 xs:p-0 mx-auto md:w-full md:max-w-md md:h-full md:max-h-md">
              <label className="font-semibold text-sm pb-1 block text-accent-content">
                Имя
              </label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button
                onClick={() => checkcode()}
                className="transition duration-200 bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Подтвердить</span>
              </button>
              <div className="py-5 text-center">
                <button
                onClick={() =>setRegst(true)}
                className="transition duration-200 bg-neutral-600 hover:bg-neutral-500 focus:bg-neutral-700 focus:shadow-sm focus:ring-4 focus:ring-neutral-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">вернутся назад</span>
                </button>
              </div>

      </div>)}

      </div>
    </>
  );
};

export default Register;
