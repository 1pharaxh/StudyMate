import { cookies } from "next/headers";

import { Mail } from "@/app/mail/components/mail";
import { accounts, mails } from "@/app/mail/data";

export default function MailPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed =
    collapsed !== undefined ? JSON.parse(collapsed.value) : undefined;

  return (
    <div className=" flex-col flex">
      <Mail
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </div>
  );
}
