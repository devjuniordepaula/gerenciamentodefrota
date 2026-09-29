import { PlansClient } from "./PlansClient";

export default async function PlansPage() {
  const plans = [
    { id: '1', title: 'Revisão Óleo e Filtros', type: 'Preventiva', frequency: '10.000 km', cost: 1200 },
    { id: '2', title: 'Revisão Freios Pesada', type: 'Preventiva', frequency: '40.000 km', cost: 3500 },
  ];
  return <PlansClient initialPlans={plans} />;
}