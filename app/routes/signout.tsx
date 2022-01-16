import { Form } from "remix";
import Button from "~/components/common/Button";
import Link from "~/components/common/Link";

export { signoutAction as action } from "~/util/auth.server";

export default function SignoutRoute() {
  return (
    <main className="max-w-sm mx-auto my-12 text-center">
      <h2 className="mb-8">Are you sure you want to sign out?</h2>
      <Form className="mb-4" method="post">
        <Button>Sign out</Button>
      </Form>
      <Link to="/api">Nope</Link>
    </main>
  );
}
