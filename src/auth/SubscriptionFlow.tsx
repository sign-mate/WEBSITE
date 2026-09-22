import { useState } from "react";
import ChangePaymentMethodForm from "./components/ChangePaymentMethodForm";
import PaymentHistory from "./components/PaymentHistory";
import SubscribeForm from "./components/SubscribeForm";
import SubscriptionOverview from "./components/SubscriptionOverview";

export type SubscriptionView = "overview" | "subscribe" | "change-payment" | "payment-history";

interface View {
  name: SubscriptionView;
}

interface Props {
  initialView?: SubscriptionView;
  onBack: () => void;
}

export default function SubscriptionFlow({ initialView = "overview", onBack }: Props) {
  const [view, setView] = useState<View>({ name: initialView });

  switch (view.name) {
    case "overview":
      return (
        <SubscriptionOverview
          onBack={onBack}
          onGoSubscribe={() => setView({ name: "subscribe" })}
          onGoChangePayment={() => setView({ name: "change-payment" })}
          onGoPaymentHistory={() => setView({ name: "payment-history" })}
        />
      );

    case "subscribe":
      return (
        <SubscribeForm
          onDone={() => setView({ name: "overview" })}
          onBack={() => setView({ name: "overview" })}
        />
      );

    case "change-payment":
      return (
        <ChangePaymentMethodForm
          onDone={() => setView({ name: "overview" })}
          onBack={() => setView({ name: "overview" })}
        />
      );

    case "payment-history":
      return <PaymentHistory onBack={() => setView({ name: "overview" })} />;
  }
}
