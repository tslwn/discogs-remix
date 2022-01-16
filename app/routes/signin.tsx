import { Form } from "remix";
import Button from "~/components/common/Button";

export {
  signinAction as action,
  signinLoader as loader,
} from "~/util/auth.server";

export default function Auth() {
  return (
    <main className="max-w-sm mx-auto my-12">
      <Form className="flex flex-col items-center w-full" method="post">
        <div className="mb-4 text-center">
          <Button>Sign in</Button>
        </div>
      </Form>
    </main>
  );
}
