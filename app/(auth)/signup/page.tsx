import Link from "next/link";

export default function signup() {
  return (
    <div>
      <h1>Sign up</h1>
      <input placeholder="Name" />
      <input placeholder="Email" />
      <button>Password</button>
      <button>Confirm Password</button>
      <button>Submit</button>
      <Link href="/login">Already have an account? Login</Link>
      <button>Sign up with google</button>
    </div>
  );
}
