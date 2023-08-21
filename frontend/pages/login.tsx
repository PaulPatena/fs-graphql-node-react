import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import styles from './login.module.css';
import { useAuth } from '@/pages/_app';
import { useRouter } from 'next/router';

interface FormData {
  email: string;
  password: string;
}

export const graphqlPost = (requestPayload: any): Promise<any> => {
  return fetch('http://localhost:4000/graphql', {
    method: 'POST',
    body: JSON.stringify(requestPayload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(resp => {
      if (![200, 201].includes(resp.status)) {
        throw new Error('API request failed');
      }
      return resp.json();
    })
    // .then(respData => {
    //   auth.setAuthToken(respData);
    // })
    .catch(err => {
      alert(err);
    });
}

export default function Login() {
  const auth = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    if (auth.authToken.length > 0) {
      router.push('/events');
    }
  }, []);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.email.trim().length === 0 || formData.password.trim().length === 0) {
      return;
    }

    if (isSignup) {
      const requestPayload = {
        query: `
          mutation {
            createUser(userInput: {email: "${formData.email}", password: "${formData.password}"}) {
              email
            }
          }
        `
      };

      graphqlPost(requestPayload).then(respData => {
        alert(`User has been created`);
        setIsSignup(false);
      })
    } else {
      const requestPayload = {
        query: `
          query {
            login (email: "${formData.email}", password: "${formData.password}") {
              userId,
              token,
              tokenExpiration
            }
          }
        `
      };

      graphqlPost(requestPayload).then(respData => {
        // console.log(respData)
        auth.setAuthToken(respData.data.login.token);
        router.push('/events');
      })
    }
  };

  return <article className={styles.loginContainer}>
    <form className={styles.formOuter} onSubmit={submitHandler}>
      <div className={styles.formInner}>
        <h2 className="typographyHeadingsLg">{isSignup ? 'Register new account' : 'User login'}</h2>

        <div className="fieldContainer">
          <div className="fieldLabel">
            <label htmlFor="email" className="typographyLabelsMd fieldLabel">E-mail</label>
          </div>
          <input type="email" id="email" name="email" value={formData.email}
                 onChange={changeHandler}
          />
        </div>

        <div className="fieldContainer">
          <div className="fieldLabel">
            <label htmlFor="password">Password</label>
          </div>
          <input type="password" id="password" name="password" value={formData.password}
                 onChange={changeHandler}
          />
        </div>

        <div className="fieldContainer">
          <button className="mr-sm" type="submit">{isSignup ? 'Register' : 'Login'}</button>
          <button onClick={(e) => {
            e.preventDefault();
            setIsSignup(p => !p);
          }}
          >{isSignup ? 'Login instead' : 'Register instead'}</button>
        </div>

      </div>
    </form>
  </article>;
}
