export function TrialAlert() {
  return (
    <a href="/upgrade" className="bg-muted px-4 py-2 text-center">
      <p className="text-sm">
        Você está usando a versão trial.{' '}
        <b className="font-semibold text-violet-500 underline">
          Faça o upgrade agora!
        </b>
      </p>
    </a>
  )
}
