import React from 'react'
import { Client } from '../../client'
import { Role } from '../models'

export function RoleView(props:{role:Role, client:Client, onClick?}){

    return (
        <div>
            <div>name</div>
            <div>image</div>
            <div>color</div>
            <div>highlight</div>
            <div>revealed player</div>
        </div>
    )
}