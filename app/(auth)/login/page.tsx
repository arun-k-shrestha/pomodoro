import Link from "next/link";

export default function login() {
  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" />
      <button>Password</button>
      <button>Submit</button>
      <Link href="/signup">Don't have an account? Signup</Link>
      <Link href="/forgot-password">Forgot password</Link>
      <button>Sign up with google</button>
    </div>
  );
}
