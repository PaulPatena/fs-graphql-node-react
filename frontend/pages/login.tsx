import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import styles from './login.module.css';
import { AuthContext } from '@/pages/_app';

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({email: '', password: ''})
  const authContext = useContext(AuthContext);
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestPayload = {
      query: `
        query {
          login (email: "${formData.email}", password: "${formData.password}") {
            token
          }
        }
      `
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestPayload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (![200, 201].includes(resp.status)) {
        throw new Error('API request failed')
      }
      return resp.json();
    })
    .then (respData => {
      authContext.onTokenReceived(respData);
    })
    .catch(err => {
      alert(err);
    })
  };

  return <article className={styles.loginContainer}>
    <h2 className='typographyHeadingsLg'>Login</h2>
    <form onSubmit={submitHandler}>

      <div className='fieldContainer'>
        <div className='fieldLabel'>
          <label htmlFor="email" className='typographyLabelsMd fieldLabel'>E-mail</label>
        </div>
        <input type="email" id="email" name="email" value={formData.email}
               onChange={changeHandler}
        />
      </div>

      <div className='fieldContainer'>
        <div className='fieldLabel'>
          <label htmlFor="password">Password</label>
        </div>
        <input type="password" id="password" name="password" value={formData.password}
               onChange={changeHandler}
        />
      </div>

      <div className='fieldContainer'>
        <button type="submit">Login</button>
      </div>
    </form>
  </article>
}
