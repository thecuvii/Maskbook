import * as React from 'react'
import { Person, Group } from '../../../database'
import { ListItem, Theme, ListItemAvatar, ListItemText } from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { makeStyles } from '@material-ui/styles'
import { Avatar } from '../../../utils/components/Avatar'
import MuiAvatar from '@material-ui/core/Avatar/Avatar'
import GroupIcon from '@material-ui/icons/Group'
import { useFriendsList } from '../../DataSource/useActivatedUI'
import { PersonIdentifier } from '../../../database/type'
import { geti18nString, useIntlListFormat } from '../../../utils/i18n'

interface SharedProps {
    onClick(): void
    disabled?: boolean
    showAtNetwork?: boolean
    listItemProps?: Partial<(typeof ListItem extends OverridableComponent<infer U> ? U : never)['props']>
}
interface GroupProps {
    type: 'group'
    item: Group
}
interface PersonProps {
    type: 'person'
    item: Person
}
const useStyle = makeStyles<Theme>(theme => ({
    overflow: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    networkHint: {
        color: theme.palette.grey[500],
    },
}))
/**
 * Item in the list
 */
export function PersonOrGroupInList(props: SharedProps & (PersonProps | GroupProps)) {
    const classes = useStyle()
    const nicknamePreviewsForGroup = useNickNamesFromList(props.type === 'group' ? props.item.members : [])
    const listFormat = useIntlListFormat()

    const { disabled, listItemProps, onClick, showAtNetwork } = props
    let name = ''
    let avatar: ReturnType<typeof Avatar>
    let secondaryText: string | undefined = undefined
    if (props.type === 'group') {
        const group = props.item
        name = group.groupName
        avatar = (
            <MuiAvatar>
                <GroupIcon />
            </MuiAvatar>
        )
        const joined = listFormat(nicknamePreviewsForGroup)
        const groupSize = group.members.length
        if (groupSize === 0) {
            secondaryText = geti18nString('person_or_group_in_list_0')
        } else if (nicknamePreviewsForGroup.length === 0) {
            secondaryText = geti18nString('person_or_group_in_list_many_no_preview', groupSize + '')
        } else if (groupSize > nicknamePreviewsForGroup.length) {
            secondaryText = geti18nString('person_or_group_in_list_many', [joined, groupSize + ''])
            secondaryText = `${joined}等 共 ${groupSize} 人`
        } else {
            secondaryText = joined
        }
    } else {
        const person = props.item
        name = person.nickname || person.identifier.userId
        avatar = <Avatar person={person} />
        secondaryText = person.fingerprint ? person.fingerprint.toLowerCase() : undefined
    }
    const withNetwork = (
        <>
            {name}
            <span className={classes.networkHint}> @ {props.item.identifier.network}</span>
        </>
    )
    return (
        <ListItem button disabled={disabled} onClick={onClick} {...(listItemProps || {})}>
            <ListItemAvatar>{avatar}</ListItemAvatar>
            <ListItemText
                classes={{ primary: classes.overflow, secondary: classes.overflow }}
                primary={showAtNetwork ? withNetwork : name}
                secondary={secondaryText}
            />
        </ListItem>
    )
}

function useNickNamesFromList(preview: readonly PersonIdentifier[]) {
    const people = useFriendsList()
    const userWithNames = React.useMemo(() => people.filter(x => x.nickname), [people])

    const [x, y, z] = preview
    const [a] = React.useMemo(() => x && userWithNames.filter(w => w.identifier.equals(x)), [userWithNames, x]) || []
    const [b] = React.useMemo(() => y && userWithNames.filter(w => w.identifier.equals(y)), [userWithNames, y]) || []
    const [c] = React.useMemo(() => z && userWithNames.filter(w => w.identifier.equals(z)), [userWithNames, z]) || []
    return React.useMemo(() => [a, b, c].filter(x => x).map(x => x.nickname!), [a, b, c])
}
