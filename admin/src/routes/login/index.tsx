import { authClient } from '@admin/src/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

type Inputs = {
  email: string
  password: string
}

function RouteComponent() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/',
      rememberMe: false,
    })

    if (error) {
      if (error.status == 401) toast.error('Email atau password salah')
      else toast.error('Login gagal dengan alasan yang tidak diketahui')
    }
  }

  return (
    <main className="w-screen h-screen grid place-items-center bg-[url(/assets/bg-login-light.png)] dark:bg-[url(/assets/bg-login-dark.png)]">
      <div className="w-full max-w-[400px] p-8 bg-base-300 shadow-lg rounded-lg">
        <h1>Sign In</h1>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              className="input w-full"
              placeholder="seseorang@email.com"
              {...register('email', { required: true })}
            />
            {errors.email?.type === 'required' && (
              <p className="label" role="alert">
                Email tidak boleh kosong
              </p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input w-full"
              placeholder="- - -"
              {...register('password')}
            />
          </fieldset>
          <button type="submit" className="w-full mt-3 btn btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </main>
  )
}
