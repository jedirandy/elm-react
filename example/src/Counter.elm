port module Counter exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)

main = Html.program { init = init, view = view, update = update, subscriptions = subscriptions }

type alias Model = { count: Int }

init = ({ count = 0 }, Cmd.none)

type Msg = Inc | Dec

update: Msg -> Model -> (Model, Cmd Msg)
update msg ({ count } as model ) =
  case msg of
    Inc -> ( { model | count = count + 1 }, notifyInc { count = count + 1 } )
    Dec -> ( { model | count = count - 1 }, notifyDec { count = count - 1 } )

port inc : (() -> msg) -> Sub msg
port dec : (() -> msg) -> Sub msg

type alias Payload = { count: Int }
port notifyInc : Payload -> Cmd msg
port notifyDec : Payload -> Cmd msg

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
      [
        inc (\_ -> Inc),
        dec (\_ -> Dec)
      ]

view: Model -> Html Msg
view model =
    div 
    [ class "counter" ] 
    [ 
      model.count
      |> toString
      |> text 
    ]
