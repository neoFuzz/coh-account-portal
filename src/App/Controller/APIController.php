<?php

namespace App\Controller;

use Psr\Container\ContainerInterface;
use Slim\Http\Request;
use Slim\Http\Response;
use App\Model\Character;
use App\Util\DataHandling;
use App\Messages\Message;
use App\Util\SqlServer;
use Exception;

class APIController
{
    protected $container;

    // constructor receives container instance
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function GetCharacter(Request $HttpRequest, Response $HttpResponse, array $HttpArgs)
    {
        $character = new Character(DataHandling::Decrypt($_GET['q'], getenv('portal_key'), getenv('portal_iv')));

        if (isset($args['type']) && 'json' == $args['type']) {
            $newResponse = $HttpResponse->withHeader('Content-type', 'application/json');

            return $newResponse->write($character->ToJSON());
        } else {
            $newResponse = $HttpResponse->withHeader('Content-type', 'text/plain');

            return $newResponse->write(implode("\n", $character->ToArray()));
        }
    }

    public function DeleteCharacter(Request $HttpRequest, Response $HttpResponse, array $HttpArgs)
    {
        $message = new Message();
        $message->Unserialize($_POST['message']);

        $characterName = DataHandling::Decrypt(urldecode($message->character), getenv('portal_key'), getenv('portal_iv'));
        $character = new Character($characterName);
        $characterData = implode("\n", $character->ToArray());

        if (false != realpath('./../backups')) {
            $backupdir = realpath('./../backups').'/'.$character->AuthName;
            if (!file_exists($backupdir)) {
                if (!mkdir($backupdir)) {
                    throw new Exception('Unable to create backupdir');
                }
            }

            $backupFile = $backupdir.'/'.preg_replace('/[^a-z0-9]+/', '-', strtolower($character->Name)).'.'.md5($characterData).'.txt';

            if (false === file_put_contents(
                $backupFile,
                $characterData
            )) {
                throw new Exception('Unable to create backup file');
            }

            // Get the owner's AuthId
            $sql = SqlServer::getInstance();
            $authId = $sql->FetchNumeric(
                'SELECT AuthId FROM '.getenv('cohdb').'.Ents WHERE Name = ?',
                array($characterName)
            );

            // Hide the character by setting the AuthId to a negative version of the normal AuthId
            $sql->Query(
                'UPDATE '.getenv('cohdb').'.Ents SET AuthId = ? WHERE Name = ?',
                array(-$authId[0][0], $character->Name)
            );

            $newResponse = $HttpResponse->withHeader('Content-type', 'text/plain');

            return $newResponse->write('Success');
            //\App\Util\MonoLogger::GetLogger()->info('Wrote '.$backupFile);
        }
    }
}
